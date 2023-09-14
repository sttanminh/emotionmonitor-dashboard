import React from 'react';
import MetricsSetting from "../components/metricsSetting/metricsSetting"

const ConfigurationPage = () => {

    var projectData = {
        projectid: '643d2f9487baeec2c1c0c2d1',
        metrics: [
            {
                metricName: 'Complexity',
                levels: [
                    {
                        levelLabel: "Low",
                        levelOrder: 1
                    }, {
                        levelLabel: "Medium",
                        levelOrder: 2
                    }, {
                        levelLabel: "High",
                        levelOrder: 3
                    }
                ],
                metricId: '64f6c424d4c684fa3223598d'
            },
            {
                metricName: 'Teamwork',
                levels: [
                    {
                        levelLabel: "Low",
                        levelOrder: 1
                    }, {
                        levelLabel: "Medium",
                        levelOrder: 2
                    }, {
                        levelLabel: "High",
                        levelOrder: 3
                    }
                ],
                metricId: ''
            },
            {
                metricName: 'Difficulty',
                levels: [
                    {
                        levelLabel: "Low",
                        levelOrder: 1
                    }, {
                        levelLabel: "Medium",
                        levelOrder: 2
                    }, {
                        levelLabel: "High",
                        levelOrder: 3
                    }
                ],
                metricId: ''
            }
        ]
    }

    return (
        <div className="body-config">
            <h1>Emotimonitor Configuration</h1>
            <p>This page allow you to manage the content shown in the Trello PowerUp, including modifying, adding, or removing metrics and adjusting emoji for each level.</p>
            <h2>Manage Metrics</h2>
            {
                // for each element in the metrics array we add a MetricsSetting component using map()
                projectData.metrics.map((metric, index) => (
                    // metric is the current element of the projectData.metrics array, index is the index of the current element in the projectData.metrics array
                    <MetricsSetting metric={metric} />
                ))
            }
        </div>
    );

};

export default ConfigurationPage;