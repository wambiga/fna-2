import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

// Embedded data from "FEES AND COSTS.xlsx - Totals school costs.csv"
const schoolCostsData = [
    { name: 'UWC-USA', annualFeesUSD: 58970.00, annualFeesLocalCurrency: 58970.00, avgAdditionalCostsUSD: 4931.50, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Red Cross Nordic', annualFeesUSD: 45575.40, annualFeesLocalCurrency: 452500.00, avgAdditionalCostsUSD: 3192.93, localCurrency: 'NOK', localCurrencyExchangeRateToUSD: 9.9286 },
    { name: 'UWC Robert Bosch College', annualFeesUSD: 43535.91, annualFeesLocalCurrency: 39400.00, avgAdditionalCostsUSD: 4069.06, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Changshu China', annualFeesUSD: 54213.75, annualFeesLocalCurrency: 386000.00, avgAdditionalCostsUSD: 826.54, localCurrency: 'CNY', localCurrencyExchangeRateToUSD: 7.1196 },
    { name: 'Waterford Kamhlaba UWCSA', annualFeesUSD: 32044.20, annualFeesLocalCurrency: 29000.00, avgAdditionalCostsUSD: 585.64, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Costa Rica', annualFeesUSD: 44700.00, annualFeesLocalCurrency: 44700.00, avgAdditionalCostsUSD: 3100.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Dilijan', annualFeesUSD: 44000.00, annualFeesLocalCurrency: 44000.00, avgAdditionalCostsUSD: 850.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Maastricht', annualFeesUSD: 41381.22, annualFeesLocalCurrency: 37450.00, avgAdditionalCostsUSD: 2630.06, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Mahindra College', annualFeesUSD: 38200.00, annualFeesLocalCurrency: 38200.00, avgAdditionalCostsUSD: 2260.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC East Africa', annualFeesUSD: 34750.00, annualFeesLocalCurrency: 34750.00, avgAdditionalCostsUSD: 1710.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Atlantic', annualFeesUSD: 63737.91, annualFeesLocalCurrency: 47300.00, avgAdditionalCostsUSD: 2939.69, localCurrency: 'GBP', localCurrencyExchangeRateToUSD: 0.7421 },
    { name: 'UWC Adriatic', annualFeesUSD: 28729.28, annualFeesLocalCurrency: 26000.00, avgAdditionalCostsUSD: 2482.87, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'Pearson College UWC', annualFeesUSD: 56791.60, annualFeesLocalCurrency: 79250.00, avgAdditionalCostsUSD: 3458.53, localCurrency: 'CAD', localCurrencyExchangeRateToUSD: 1.3951 },
    { name: 'Li Po Chun UWC', annualFeesUSD: 51038.73, annualFeesLocalCurrency: 398000.00, avgAdditionalCostsUSD: 2458.58, localCurrency: 'HKD', localCurrencyExchangeRateToUSD: 7.798 },
    { name: 'UWC South East Asia', annualFeesUSD: 71376.34, annualFeesLocalCurrency: 93217.50, avgAdditionalCostsUSD: 7913.10, localCurrency: 'SGD', localCurrencyExchangeRateToUSD: 1.306 },
    { name: 'UWC Thailand', annualFeesUSD: 53912.86, annualFeesLocalCurrency: 1753970.00, avgAdditionalCostsUSD: 4236.46, localCurrency: 'THB', localCurrencyExchangeRateToUSD: 32.5324 },
    { name: 'UWC Mostar', annualFeesUSD: 25414.36, annualFeesLocalCurrency: 23000.00, avgAdditionalCostsUSD: 3425.41, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC ISAK Japan', annualFeesUSD: 49544.76, annualFeesLocalCurrency: 7455200.00, avgAdditionalCostsUSD: 2774.78, localCurrency: 'JPY', localCurrencyExchangeRateToUSD: 150.470 },
];

const initialFormState = {
    // ... initial form state object
};

// Placeholder components for the tab content to preserve the original structure
const GeneralTab = ({ formData, handleFormChange }) => (
    <div>
        <h2>General Info</h2>
        {/* Actual form fields would be here */}
    </div>
);
const ParentTab = ({ formData, handleFormChange }) => (
    <div>
        <h2>Parent/Guardian Info</h2>
        {/* Actual form fields would be here */}
    </div>
);
const StudentTab = ({ formData, handleFormChange }) => (
    <div>
        <h2>Student Info</h2>
        {/* Actual form fields would be here */}
    </div>
);
const ResultsTab = ({ formData, costData }) => (
    <div>
        <h2>Results & Assessment</h2>
        {/* Actual results display logic would be here */}
    </div>
);


const App = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [activeTab, setActiveTab] = useState('general');

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResetForm = () => {
        setFormData(initialFormState);
        setActiveTab('general');
    };

    // Placeholder for cost calculation memoization
    const costData = useMemo(() => {
        // In a real app, logic to filter/select/calculate costs based on formData would go here.
        // For this update, we just expose the full data structure if needed.
        return schoolCostsData;
    }, [/* formData.selectedSchool */]);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralTab formData={formData} handleFormChange={handleFormChange} />;
            case 'parent':
                return <ParentTab formData={formData} handleFormChange={handleFormChange} />;
            case 'student':
                return <StudentTab formData={formData} handleFormChange={handleFormChange} />;
            case 'results':
                return <ResultsTab formData={formData} costData={costData} />;
            default:
                return null;
        }
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1>UWC Financial Need Assessment Tool</h1>
                <p>Estimate a family's financial contribution and a student's potential scholarship need.</p>
            </header>
            <main>
                <div className="form-container">
                    <nav className="tabs">
                        <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>General Info</button>
                        <button className={activeTab === 'parent' ? 'active' : ''} onClick={() => setActiveTab('parent')}>Parent/Guardian</button>
                        <button className={activeTab === 'student' ? 'active' : ''} onClick={() => setActiveTab('student')}>Student</button>
                        <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>Results</button>
                    </nav>
                    {renderTabContent()}
                    {activeTab !== 'results' && (
                        <div className="reset-button-container">
                            <button onClick={handleResetForm} className="reset-button">Reset All Fields</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;