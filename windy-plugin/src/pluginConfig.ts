import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-dfs-airspaces',
    version: '0.1.0',
    icon: '✈',
    title: 'DFS Airspaces',
    description: 'DFS Airspaces',
    author: 'Fledervie',
    repository: 'https://github.com/Fledervie/dfs-airspace-data',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/dfs-airspaces',
    private: true,
};

export default config;
