import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-dfs-airspaces',
    version: '0.1.2',
    icon: '✈',
    title: 'DFS Airspaces',
    description: 'DFS Airspaces',
    author: 'Fledervie',
    repository: 'https://github.com/Fledervie/dfs-airspaces-project',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/dfs-airspaces',
    private: false,
};

export default config;
