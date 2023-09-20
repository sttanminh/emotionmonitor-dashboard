import React, { useState } from "react"
import styles from "./metricsSetting.module.css"; // Import the CSS module
import Link from 'next/link';
import { FaEdit, FaRegTrashAlt, FaSave, FaRegStopCircle, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

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

// determine what will be passed to the component
interface MetricsSettingProps {
    metric: Metric
    index: number
    onDeleteButtonClick: () => void
    onAddLevelButtonClick: () => void
    // onDeleteLevelButtonClick needs levelIndex so it can pass to deleteLevel in config.tsx
    onDeleteLevelButtonClick: (levelIndex: number) => void 
}

const MetricsSetting: React.FC<MetricsSettingProps> = ({ metric, index, onDeleteButtonClick, onAddLevelButtonClick, onDeleteLevelButtonClick}) => {
    const [isEditing, setIsEditing] = useState(false);

    const editButtonClick = () => {
        setIsEditing(true);
    }

    const cancelButtonClick = () => {
        setIsEditing(false);
    }

    // deleteButtonClick called onDeleteButtonClick(), which called deleteMetric in config.tsx
    // onDeleteButtonClick() didn't need to pass any arg as "onDeleteButtonClick={() => deleteMetric(index)}" in config.tsx already passed the index
    const deleteButtonClick = () => {
        onDeleteButtonClick();
    }

    // addLevelButtonClick called onAddLevelButtonClick(), which called addLevel in config.tsx
    const addLevelButtonClick = () => {
        onAddLevelButtonClick();
    }

    // deleteLevelButtonClick called onDeleteLevelButtonClick(), which called deleteLevel in config.tsx
    // deleteLevelButtonClick get the levelIndex, pass it to onDeleteLevelButtonClick(), which is then pass to deleteLevel in config.tsx
    const deleteLevelButtonClick = (levelIndex: number) => {
        onDeleteLevelButtonClick(levelIndex);
    }

    return (
        <div className={styles.metricContainer}>
            {isEditing ? (
                // if the user is in editing mode
                <input className={styles.textBox} type="text" placeholder={metric.metricName} />
            ) : (
                // if the user is not in editing mode
                <b>{metric.metricName}</b>
            )}
            <button onClick={editButtonClick} className={styles.button}>
                <FaEdit size={18} style={{ color: "#50C878", marginLeft: "5px" }} />
            </button>
            <button onClick={deleteButtonClick} className={styles.button}>
                <FaRegTrashAlt size={18} style={{ color: "#EE4B2B" }} />
            </button>
            <div className={styles.levelsContainer}>
                {
                    // for each element in the levels array we add a div using map()
                    metric.levels.map((level, index) => (
                        <div key={index} className={styles.level}>
                            {isEditing ? (
                                // if the user is in editing mode display the level as textboxs and allow removing level
                                <div>
                                    <input className={styles.textBox} type="text" placeholder={level.levelLabel} />
                                    <button onClick={() => deleteLevelButtonClick(index)} className={styles.button}>
                                        <FaMinusCircle size={18} style={{ color: "#EE4B2B", marginTop: "10px" }} />
                                    </button>
                                </div>
                            ) : (
                                // if the user is not in eiditing mode
                                level.levelLabel
                            )}
                        </div>
                    ))
                }
            </div>
            {
                // add a Save, Add and Cancel button if the user is in editing mode
                isEditing &&
                <div>
                    <button onClick={cancelButtonClick} className={styles.button}>
                        <FaRegStopCircle size={18} style={{ color: "#EE4B2B", marginTop: "10px" }} />
                    </button>
                    <button onClick={addLevelButtonClick} className={styles.button} >
                        <FaPlusCircle size={18} style={{ color: "#50C878" }} />
                    </button>
                    <button className={styles.button} >
                        <FaSave size={18} style={{ color: "#0096FF" }} />
                    </button>
                </div>
            }
        </div >
    );
}

export default MetricsSetting;