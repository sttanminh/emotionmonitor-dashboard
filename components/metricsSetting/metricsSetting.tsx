import React from "react"
import styles from "./metricsSetting.module.css"; // Import the CSS module
import Link from 'next/link';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';


interface MetricLevel {
    levelLabel: string
    levelOrder: number
}


interface Metric {
    metricName: string
    levels: MetricLevel[]
}


interface MetricsSettingProps {
    metric: Metric
}

const MetricsSetting: React.FC<MetricsSettingProps> = ({ metric }) => {
    return (
        <div className={styles.metricContainer}>{metric.metricName}
            <Link href="/">
                <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
            </Link>
            <div className={styles.levelContainer}><b>Levels:</b>
                {
                
                    metric.levels.map((level) => ( 
                        <div>{level.levelLabel}
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