import React, { useState } from 'react';
import MetricsSetting from "../components/metricsSetting/metricsSetting"
import Link from 'next/link';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const ConfigurationPage = () => {

    const initialProjectData  = {
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
                    }, {
                        levelLabel: "Extreme",
                        levelOrder: 3
                    }
                ],
                metricId: ''
            },
            {
                metricName: 'Timespan',
                levels: [
                    {
                        levelLabel: "Short",
                        levelOrder: 1
                    }, {
                        levelLabel: "Reasonable",
                        levelOrder: 2
                    }, {
                        levelLabel: "Long",
                        levelOrder: 3
                    }
                ],
                metricId: ''
            }
        ]
    }

    // maintain projectDate so the UI re-render when changes happen
    const [projectData, setProjectData] = useState(initialProjectData)

    // function to delete a metric from the project data
    const deleteMetric = ( indexToDelete: number ) => {
        // create a new object that contains the modified data
        const updatedData = {...projectData}
        updatedData.metrics.splice(indexToDelete, 1)
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData});
        console.log(projectData.metrics)
    }

    return (
        <div className="body-config">
            <h1>Emotimonitor Configuration</h1>
            <p>This page allow you to manage the content shown in the Trello PowerUp, including modifying, adding, or removing metrics and adjusting emoji for each level.</p>
            <h2>Manage Metrics</h2>
            <div className='metric-container'>
                {
                    // for each element in the metrics array we add a MetricsSetting component using map()
                    projectData.metrics.map((metric, index) => (
                        // metric is the current element of the projectData.metrics array, index is the index of the current element in the projectData.metrics array
                        <MetricsSetting index={index} metric={metric} onDeleteButtonClick={() => deleteMetric(index)} />
                    ))
                }
            </div>
        </div>
    );

};

export default ConfigurationPage;