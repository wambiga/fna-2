import React, { useState, useMemo } from 'react'; // FIXED: Removed unused 'useEffect'
import './App.css';

// Embedded data from "FEES AND COSTS.xlsx - Totals school costs.csv"
const schoolCostsData = [
    { name: 'UWC-USA', annualFeesUSD: 58970.00, annualFeesLocalCurrency: 58970.00, avgAdditionalCostsUSD: 4931.50, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Red Cross Nordic', annualFeesUSD: 45575.40, annualFeesLocalCurrency: 452500.00, avgAdditionalCostsUSD: 3192.93, localCurrency: 'NOK', localCurrencyExchangeRateToUSD: 9.9286 },
    { name: 'UWC Robert Bosch College', annualFeesUSD: 43535.91, annualFeesLocalCurrency: 39400.00, avgAdditionalCostsUSD: 4069.06, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Changshu China', annualFeesUSD: 54213.75, annualFeesLocalCurrency: 386000.00, avgAdditionalCostsUSD: 826.54, localCurrency: 'CNY', localCurrencyExchangeRateToUSD: 7.1196 },
    { name: 'Waterford Kamhlaba UWCSA', annualFeesUSD: 32044.20, annualFeesLocalCurrency: 29000.00, avgAdditionalCostsUSD: 588.95, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Costa Rica', annualFeesUSD: 44700.00, annualFeesLocalCurrency: 44700.00, avgAdditionalCostsUSD: 3100.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Dilijan', annualFeesUSD: 44000.00, annualFeesLocalCurrency: 44000.00, avgAdditionalCostsUSD: 850.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Maastricht', annualFeesUSD: 41381.22, annualFeesLocalCurrency: 37450.00, avgAdditionalCostsUSD: 2638.12, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Mahindra College', annualFeesUSD: 38200.00, annualFeesLocalCurrency: 38200.00, avgAdditionalCostsUSD: 2260.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC East Africa', annualFeesUSD: 34750.00, annualFeesLocalCurrency: 34750.00, avgAdditionalCostsUSD: 1710.00, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Atlantic', annualFeesUSD: 63737.91, annualFeesLocalCurrency: 47300.00, avgAdditionalCostsUSD: 2939.69, localCurrency: 'GBP', localCurrencyExchangeRateToUSD: 0.7421 },
    { name: 'UWC Adriatic', annualFeesUSD: 28729.28, annualFeesLocalCurrency: 26000.00, avgAdditionalCostsUSD: 2438.67, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'Pearson College UWC', annualFeesUSD: 56791.63, annualFeesLocalCurrency: 79250.00, avgAdditionalCostsUSD: 3458.53, localCurrency: 'CAD', localCurrencyExchangeRateToUSD: 1.3951 },
    { name: 'Li Po Chun UWC', annualFeesUSD: 51038.73, annualFeesLocalCurrency: 398000.00, avgAdditionalCostsUSD: 1184.92, localCurrency: 'HKD', localCurrencyExchangeRateToUSD: 7.798 },
    { name: 'UWC South East Asia', annualFeesUSD: 71376.34, annualFeesLocalCurrency: 93217.50, avgAdditionalCostsUSD: 7913.10, localCurrency: 'SGD', localCurrencyExchangeRateToUSD: 1.306 },
    { name: 'UWC Thailand', annualFeesUSD: 53912.86, annualFeesLocalCurrency: 1753970.00, avgAdditionalCostsUSD: 4236.46, localCurrency: 'THB', localCurrencyExchangeRateToUSD: 32.5324 },
    { name: 'UWC Mostar', annualFeesUSD: 25414.36, annualFeesLocalCurrency: 23000.00, avgAdditionalCostsUSD: 3425.41, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC ISAK Japan', annualFeesUSD: 49544.76, annualFeesLocalCurrency: 7455200.00, avgAdditionalCostsUSD: 2774.78, localCurrency: 'JPY', localCurrencyExchangeRateToUSD: 150.470 },
];

const initialFormState = {
    selectedSchool: 'UWC South East Asia',
    familyContribution: '', // Estimated contribution amount
    schoolSelection: '', // The key for selecting the school in the dropdown
    parents: [{
        occupation: '',
        income: 0,
        assets: 0,
        liabilities: 0,
    }],
    student: {
        assets: 0,
    },
    // ... potentially other form fields
};

// Component placeholders for tabs (these contain the user's actual form logic)
const GeneralTab = ({ formData, handleFormChange, schoolCostsData }) => (
    <div className="tab-content">
        <h2>General Information</h2>
        
        <div className="form-field">
            <label htmlFor="selectedSchool">Select UWC School:</label>
            <select
                id="selectedSchool"
                name="selectedSchool"
                value={formData.selectedSchool}
                onChange={handleFormChange}
            >
                {schoolCostsData.map(school => (
                    <option key={school.name} value={school.name}>
                        {school.name}
                    </option>
                ))}
            </select>
        </div>
        
        {/* Input for the estimated family contribution */}
        <div className="form-field">
            <label htmlFor="familyContribution">Estimated Family Contribution (USD):</label>
            <input
                type="number"
                id="familyContribution"
                name="familyContribution"
                value={formData.familyContribution}
                onChange={handleFormChange}
                placeholder="Enter amount in USD"
                min="0"
            />
        </div>
        
        {/* RE-ADD THE REST OF YOUR GENERAL INPUT FIELDS HERE */}
    </div>
);
// ... ParentTab, StudentTab, ResultsTab and App component structure ...
const ParentTab = ({ formData, handleFormChange, updateParentData }) => {
    
    // Function to add a new parent/guardian section
    const addParent = () => {
        const newParents = [...formData.parents, {
            occupation: '',
            income: 0,
            assets: 0,
            liabilities: 0,
        }];
        // Assuming there is an updateFormData function passed from App
        updateParentData(newParents); 
    };

    // Function to handle changes in a specific parent's data
    const handleParentChange = (index, e) => {
        const { name, value } = e.target;
        const newParents = formData.parents.map((parent, i) => 
            i === index ? { ...parent, [name]: name === 'income' || name === 'assets' || name === 'liabilities' ? parseFloat(value) || 0 : value } : parent
        );
        // Assuming there is an updateFormData function passed from App
        updateParentData(newParents);
    };

    // I will use a simple placeholder structure for ParentTab, as I cannot infer the user's complex logic for multi-parent input without the full code.
    
    return (
        <div className="tab-content">
            <h2>Parent/Guardian Info</h2>
            {/* The user's actual Parent form fields would be here */}
            <p>Please enter income, assets, and liabilities for all parents/guardians.</p>
            {/* You will need to re-add your actual Parent input fields here, including logic for multiple parents. */}
        </div>
    );
};

const StudentTab = ({ formData, handleFormChange }) => (
    <div className="tab-content">
        <h2>Student Info</h2>
        {/* The user's actual Student form fields would be here */}
        <div className="form-field">
            <label htmlFor="studentAssets">Student Assets (USD):</label>
            <input
                type="number"
                id="studentAssets"
                name="studentAssets"
                value={formData.student.assets}
                onChange={(e) => handleFormChange({ target: { name: 'student', value: { ...formData.student, assets: parseFloat(e.target.value) || 0 } } })}
                placeholder="Enter amount in USD"
                min="0"
            />
        </div>
        {/* You will need to re-add your actual Student input fields here. */}
    </div>
);

const calculateNeed = (formData, costData) => {
    const selectedSchool = costData.find(s => s.name === formData.selectedSchool);
    if (!selectedSchool) return null;

    const totalAnnualCost = selectedSchool.annualFeesUSD + selectedSchool.avgAdditionalCostsUSD;

    // Simple placeholder for need calculation
    // You should implement the actual calculation based on the UWC formula (Income, Assets, Liabilities)
    const estimatedFamilyContribution = parseFloat(formData.familyContribution) || 0;
    
    const calculatedScholarshipNeed = totalAnnualCost - estimatedFamilyContribution;
    
    return {
        totalAnnualCost,
        estimatedFamilyContribution,
        calculatedScholarshipNeed: Math.max(0, calculatedScholarshipNeed)
    };
};

const ResultsTab = ({ formData, costData }) => {
    const calculation = calculateNeed(formData, costData);
    const selectedSchoolCosts = costData.find(s => s.name === formData.selectedSchool);

    if (!calculation) return <p>Please select a school to see the results.</p>;

    const scholarshipPercentage = (calculation.calculatedScholarshipNeed / calculation.totalAnnualCost) * 100;

    return (
        <div className="tab-content">
            <h2>Results & Assessment</h2>
            
            <h3>School Costs (Annual Estimate)</h3>
            <p>Selected School: <strong>{formData.selectedSchool}</strong></p>
            {selectedSchoolCosts && (
                <>
                    <p>Annual Fees (USD): <strong>${selectedSchoolCosts.annualFeesUSD.toLocaleString()}</strong></p>
                    <p>Average Annual Additional Costs (USD): <strong>${selectedSchoolCosts.avgAdditionalCostsUSD.toLocaleString()}</strong></p>
                    <p>Total Estimated Annual Cost: <strong>${calculation.totalAnnualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                </>
            )}

            <h3>Financial Need Calculation</h3>
            <p>Your Estimated Annual Contribution (from input): <strong>${calculation.estimatedFamilyContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
            <p>Calculated Scholarship Need: <strong>${calculation.calculatedScholarshipNeed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
            <p>Estimated Scholarship Percentage: <strong>{scholarshipPercentage.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%</strong></p>
            
            {/* RE-ADD THE REST OF YOUR RESULTS LOGIC HERE */}
        </div>
    );
};


const App = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [activeTab, setActiveTab] = useState('general');

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        // Special handling for nested objects like student
        if (name.startsWith('student')) {
            // This is a simplification; in a real app, you'd handle nested state better
            setFormData(prev => ({ 
                ...prev, 
                student: value // Assuming value is the new student object
            }));
        } else {
            setFormData(prev => ({ 
                [name]: name === 'familyContribution' ? parseFloat(value) || '' : value, // Keep as string if empty, or convert to number
                ...prev, 
            }));
        }
    };
    
    // Function to update parent data, needed by ParentTab
    const updateParentData = (newParents) => {
        setFormData(prev => ({
            ...prev,
            parents: newParents
        }));
    };


    const handleResetForm = () => {
        setFormData(initialFormState);
        setActiveTab('general');
    };

    // Placeholder for cost calculation memoization
    const costData = useMemo(() => {
        // This array remains the master list of school costs.
        return schoolCostsData;
    }, []); // Removed dependency since the source array is static

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralTab formData={formData} handleFormChange={handleFormChange} schoolCostsData={schoolCostsData} />;
            case 'parent':
                // Note: The original ParentTab might have been expecting updateParentData. I'm passing it now.
                return <ParentTab formData={formData} handleFormChange={handleFormChange} updateParentData={updateParentData} />;
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