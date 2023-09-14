import React from "react"
import styles from "./metricsSetting.module.css"; // Import the CSS module
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from "semantic-ui-react";

interface MetricsSettingProps {
    metricName: string,
}

const MetricsSetting: React.FC<MetricsSettingProps> = ({ metricName }) => {
    return (
        <div className={styles.metricContainer}>{metricName}
            <Link href="/">
                <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
            </Link>
            <div className={styles.levelContainer}><b>Levels:</b>
                <div>Low
                    <Link href="/">
                        <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                        <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
                    </Link>
                </div>
                <div>Medium
                    <Link href="/">
                        <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                        <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
                    </Link>
                </div>
                <div>High
                    <Link href="/">
                        <FaEdit size={18} style={{ color: "#50C878", marginLeft: "20px" }} />
                        <FaRegTrashAlt size={18} style={{ color: "#EE4B2B", marginLeft: "15px" }} />
                    </Link>
                </div>
            </div>
        </div >
    );
}
    
export default MetricsSetting;