import React, { useState } from 'react';
import MetricsSetting from "../components/metricsSetting/metricsSetting"
import { GetServerSidePropsContext } from "next";
import { FaPlusCircle } from 'react-icons/fa';
import { getProject } from "./api/projects";

export type ProjectProps = {
    projectId: string,
    metrics: {
        metricId: string;
        metricName: string;
        levels: {
            levelLabel: string,
            levelOrder: number
        }[]
    }[],
    emojis: string[],
    referenceNumber: number
}

const ConfigurationPage = (initialProjectData: ProjectProps) => {
    // maintain projectData so the UI re-render when changes happen
    const [projectData, setProjectData] = useState(initialProjectData)

    // function to delete a metric from the project data
    const deleteMetric = async (indexToDelete: number) => {
        // create a new object that contains the modified data
        const updatedData = { ...projectData };
        updatedData.metrics.splice(indexToDelete, 1);
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData });
        await saveToBackEnd()
    }

    // function to add a level to a metric
    const addLevel = (metricIndex: number) => {
        // create a level object
        const newLevel = {
            levelLabel: "New Level",
            levelOrder: projectData.metrics[metricIndex].levels.length + 1,
        }
        // create a new object that contains the modified data
        const updatedData = { ...projectData };
        updatedData.metrics[metricIndex].levels.push(newLevel);
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData });
    }

    // function to add a new metric
    const addMetric = () => {
        // create a metric object
        const newMetric = {
            metricName: 'New Metric',
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
        // create a new object that contains the modified data
        const updatedData = { ...projectData };
        updatedData.metrics.push(newMetric);
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData });
    }

    // function to delete a levels
    const deleteLevel = (metricIndex: number, levelIndex: number) => {
        // create a new object that contains the modified data
        const updatedData = { ...projectData };
        updatedData.metrics[metricIndex].levels.splice(levelIndex, 1);
        // reset the level order after deletion
        updatedData.metrics[metricIndex].levels.forEach((level, index) => {
            level.levelOrder = index + 1;
        });
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData });
    }

    // function to rename the level
    const updateLvLabel = (metricIndex: number, levelIndex: number, newLvLabel: string) => {
        // create a new object that contains the modified data
        const updatedData = { ...projectData };
        updatedData.metrics[metricIndex].levels[levelIndex].levelLabel = newLvLabel;
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData });
    }

    // function to rename the metric name
    const updateMetricName = (metricIndex: number, newMetricName: string) => {
        // create a new object that contains the modified data
        const updatedData = { ...projectData };
        updatedData.metrics[metricIndex].metricName = newMetricName
        // update the state with the new object to triggers re-render of component
        setProjectData({ ...updatedData });
    }

    const saveToBackEnd = async () => {
        console.log(projectData)
        const response = await fetch('/api/projects', {
            method: 'PUT',
            body: JSON.stringify({
                projectData: projectData
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }



    return (
        <div className="body-config">
            <section className='background'>
                <h1>Emotimonitor Configuration</h1>
                <p>This page allow you to manage the content shown in the Trello PowerUp, including modifying, adding, or removing metrics and adjusting emoji for each level.</p>
                <div className="header-container">
                    <h2>Manage Metrics</h2>
                    <button className="trans-button" onClick={addMetric}>
                        <FaPlusCircle size={18} style={{ color: "#50C878" }} />
                    </button>
                </div>
                <div className='metric-container'>
                    {
                        // for each element in the metrics array we add a MetricsSetting component using map()
                        projectData.metrics.map((metric, index) => (
                            // metric is the current element of the projec tData.metrics array, index is the index of the current element in the projectData.metrics array
                            <MetricsSetting
                                key={index}
                                index={index}
                                metric={metric}
                                onDeleteButtonClick={() => deleteMetric(index)}
                                onAddLevelButtonClick={() => addLevel(index)}
                                // levelIndex need to be passed from the component hence: (levelIndex: number)
                                onDeleteLevelButtonClick={(levelIndex: number) => deleteLevel(index, levelIndex)}
                                onSaveButtonClick={() => saveToBackEnd()}
                                onMetricNameChange={(updatedMetricName: string) => updateMetricName(index, updatedMetricName)}
                                onLevelLabelChange={(levelIndex: number, updatedLvLabel: string) => updateLvLabel(index, levelIndex, updatedLvLabel)} />
                        ))
                    }
                </div>
            </section>
        </div>
    );

};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { data } = context.query;
    var projectId = data as string
    projectId = projectId.replaceAll('"', '')
    var project = await getProject(projectId)
    var projectData: ProjectProps = {
        projectId: projectId,
        metrics: [],
        emojis: project?.emojis!,
        referenceNumber: project?.referenceNumber!
    }
    var metricArray = []
    var metricDictionary: any = {}

    project?.metrics
        .filter((metric) => metric.active)
        .forEach(metric => {
            metricDictionary[metric.id] = {
                metricName: metric.name,
                levels: []
            }
            metric.levels.forEach((level: any) => {
                metricDictionary[metric.id].levels.push({
                    levelLabel: level.levelLabel,
                    levelOrder: level.levelOrder
                })
            });
        })
    for (let key in metricDictionary) {
        metricArray.push({ ...metricDictionary[key], metricId: key })
    }
    projectData.metrics = metricArray
    return {
        props: projectData
    }
}

export default ConfigurationPage;