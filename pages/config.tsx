import React from 'react';
import MetricsSetting from "../components/metricsSetting/metricsSetting"

const ConfigurationPage = () => {

    return (
        <div className="body-config">
            <h1>Emotimonitor Configuration</h1>
            <p>This page allow you to manage the content shown in the Trello PowerUp, including modifying, adding, or removing metrics and adjusting emoji for each level.</p>
            <h2>Manage Metrics</h2>
            <MetricsSetting/>
        </div>
    );

};

export default ConfigurationPage;