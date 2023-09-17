import React, { useState } from "react"
import styles from "./metricsSetting.module.css"; // Import the CSS module
import Link from 'next/link';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { Button } from "semantic-ui-react";

// represent an element in the level array. Consist of a label and the order
interface MetricLevel {
    levelLabel: string
    levelOrder: number
}

// represent the metric objet to be passed to the component. Consist of a name, a levels array and the metric id (based on the data structure)
interface Metric {
    metricName: string
    levels: MetricLevel[]
    metricId: string
}

// determine what will be passed to the component. In this case, a metric object
interface MetricsSettingProps {
    metric: Metric
}

const MetricsSetting: React.FC<MetricsSettingProps> = ({ metric }) => {
    const [isEditing, setIsEditing] = useState(false);

    const editButtonClick = () => {
        setIsEditing(true);
    }

    const cancelButtonClick = () => {
        setIsEditing(false);
    }

    const saveButtonClick = () => {
        setIsEditing(false);
    }


    return (
        <div className={styles.metricContainer}>
            {isEditing ? (
                // if the user is in editing mode
                <input type="text" placeholder={metric.metricName} onChange={(e) => { }} />
            ) : (
                // if the user is not in editing mode
                <b>{metric.metricName}</b>
            )}
            <button onClick={editButtonClick} className={styles.button}>
                <FaEdit size={18} style={{ color: "#50C878", marginLeft: "5px" }} />
            </button>
            <button className={styles.button}>
                <FaRegTrashAlt size={18} style={{ color: "#EE4B2B" }} />
            </button>
            <div className={styles.levelsContainer}>
                {
                    // for each element in the levels array we add a div using map()
                    metric.levels.map((level, index) => (
                        <div key={index} className={styles.level}>
                            {isEditing ? (
                                // if the user is in editing mode
                                <input type="text" placeholder={level.levelLabel} onChange={(e) => { }} />
                            ) : (
                                // if the user is not in eiditing mode
                                level.levelLabel
                            )}
                        </div>
                    ))
                }
            </div>
            {
                // add a save and cancel button is the user is in editing mode
                isEditing &&
                <div>
                    <button onClick={cancelButtonClick}>Cancel</button>
                    <button onClick={saveButtonClick}>Save</button>
                </div>
            }
        </div >
    );
}

export default MetricsSetting;