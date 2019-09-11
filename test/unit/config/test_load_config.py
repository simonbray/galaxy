import pytest

from galaxy.config import GalaxyAppConfiguration


MOCK_PROPERTIES = {
    'property1': {'default': 'a', 'type': 'str'},  # str
    'property2': {'default': 1, 'type': 'int'},  # int
    'property3': {'default': 1.0, 'type': 'float'},  # float
    'property4': {'default': True, 'type': 'bool'},  # bool
    'property5': {'something_else': 'b', 'type': 'invalid'},
    'property6': {'something_else': 'b'},  # no type
}


@pytest.fixture
def mock_init(monkeypatch):

    def mock_load_schema(self):
        self.appschema = MOCK_PROPERTIES

    def mock_process_config(self, kwargs):
        pass

    monkeypatch.setattr(GalaxyAppConfiguration, '_load_schema', mock_load_schema)
    monkeypatch.setattr(GalaxyAppConfiguration, '_process_config', mock_process_config)


def test_load_config_from_schema(mock_init):
    config = GalaxyAppConfiguration()

    assert len(config._raw_config) == 6
    assert config._raw_config['property1'] == 'a'
    assert config._raw_config['property2'] == 1
    assert config._raw_config['property3'] == 1.0
    assert config._raw_config['property4'] is True
    assert config._raw_config['property5'] is None
    assert config._raw_config['property6'] is None

    assert type(config._raw_config['property1']) is str
    assert type(config._raw_config['property2']) is int
    assert type(config._raw_config['property3']) is float
    assert type(config._raw_config['property4']) is bool


def test_update_raw_config_from_kwargs(mock_init):
    config = GalaxyAppConfiguration(property2=2, property3=2.0, another_key=66)

    assert len(config._raw_config) == 6   # no change: another_key NOT added
    assert config._raw_config['property1'] == 'a'  # no change
    assert config._raw_config['property2'] == 2  # updated
    assert config._raw_config['property3'] == 2.0  # updated
    assert config._raw_config['property4'] is True  # no change
    assert config._raw_config['property5'] is None  # no change
    assert config._raw_config['property6'] is None  # no change

    assert type(config._raw_config['property1']) is str
    assert type(config._raw_config['property2']) is int
    assert type(config._raw_config['property3']) is float
    assert type(config._raw_config['property4']) is bool


def test_update_raw_config_from_string_kwargs(mock_init):
    # kwargs may be passed as strings: property data types should not be affected
    config = GalaxyAppConfiguration(property1='b', property2='2', property3='2.0', property4='false')

    assert len(config._raw_config) == 6  # no change
    assert config._raw_config['property1'] == 'b'  # updated
    assert config._raw_config['property2'] == 2  # updated
    assert config._raw_config['property3'] == 2.0  # updated
    assert config._raw_config['property4'] is False  # updated

    assert type(config._raw_config['property1']) is str
    assert type(config._raw_config['property2']) is int
    assert type(config._raw_config['property3']) is float
    assert type(config._raw_config['property4']) is bool
