import Backbone from "backbone";
import { getGalaxyInstance } from "app";
import mod_shed_list_view from "mvc/toolshed/shed-list-view";
import mod_categories_view from "mvc/toolshed/categories-view";
import mod_repositories_view from "mvc/toolshed/repositories-view";
import mod_repository_view from "mvc/toolshed/repository-view";
import mod_repoqueue_view from "mvc/toolshed/repository-queue-view";
import mod_repo_status_view from "mvc/toolshed/repo-status-view";
import mod_workflows_view from "mvc/toolshed/workflows-view";

var AdminToolshedRouter = Backbone.Router.extend({
    routes: {
        "": "toolsheds",
        sheds: "toolsheds",
        queue: "queue",
        workflows: "workflows",
        "status/r/:repositories": "status",
        status: "status",
        "categories/s/:tool_shed": "categories",
        "category/s/:tool_shed/c/:category_id/k/:sort_key/p/:page/t/:sort_order": "repositories",
        "repository/s/:tool_shed/r/:repository_id": "repository"
    }
});

var GalaxyAdminToolshedApp = Backbone.View.extend({
    app_config: {
        known_views: ["toolsheds", "queue", "status", "categories", "repositories", "repository"]
    },

    initialize: function() {
        const Galaxy = getGalaxyInstance();

        Galaxy.admintoolshedapp = this;
        this.admin_toolshed_router = new AdminToolshedRouter();

        this.admin_toolshed_router.on("route:queue", () => {
            Galaxy.admintoolshedapp.adminRepoQueueView = new mod_repoqueue_view.RepoQueueView();
        });
        this.admin_toolshed_router.on("route:toolsheds", () => {
            Galaxy.admintoolshedapp.adminShedListView = new mod_shed_list_view.ShedListView();
        });
        this.admin_toolshed_router.on("route:categories", tool_shed => {
            Galaxy.admintoolshedapp.adminShedCategoriesView = new mod_categories_view.CategoryView({
                tool_shed: tool_shed.replace(/\//g, "%2f")
            });
        });
        this.admin_toolshed_router.on(
            "route:repositories",
            (tool_shed, category_id, sort_key = "name", page = 1, sort_order = "asc") => {
                Galaxy.admintoolshedapp.adminShedCategoryView = new mod_repositories_view.Category({
                    tool_shed: tool_shed.replace(/\//g, "%2f"),
                    category_id: category_id,
                    page: page,
                    sort_order: sort_order,
                    sort_key: sort_key
                });
            }
        );
        this.admin_toolshed_router.on("route:repository", (tool_shed, repository_id) => {
            Galaxy.admintoolshedapp.adminRepositoryView = new mod_repository_view.RepoDetails({
                tool_shed: tool_shed.replace(/\//g, "%2f"),
                repository_id: repository_id
            });
        });
        this.admin_toolshed_router.on("route:status", repositories => {
            Galaxy.admintoolshedapp.adminRepoStatusView = new mod_repo_status_view.RepoStatus({
                repositories: repositories.split("|")
            });
        });
        this.admin_toolshed_router.on("route:workflows", () => {
            Galaxy.admintoolshedapp.adminWorkflowsView = new mod_workflows_view.Workflows();
        });

        Backbone.history.start({ pushState: false });
    }
});

export default {
    GalaxyApp: GalaxyAdminToolshedApp
};
