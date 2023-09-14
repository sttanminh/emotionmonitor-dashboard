import React from "react"
import styles from "./metricsSetting.module.css"; // Import the CSS module
import Link from 'next/link';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

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
    return (
        <div className={styles.metricContainer}><b>{metric.metricName}</b>
            <Link href="/">
                <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
            </Link>

            <div className={styles.levelsContainer}>
                {
                    // for each element in the levels array we add a level div using map()
                    metric.levels.map((level) => ( // level is the current element of the metric.levels array
                        <div className={styles.level}>{level.levelLabel}
                            <Link href="/">
                                <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                                <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div >
    );
}

export default MetricsSetting;