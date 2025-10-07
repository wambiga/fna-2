import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

// Embedded data from "FEES AND COSTS.xlsx - Totals school costs.csv"
const schoolCostsData = [
    { name: 'UWC South East Asia', annualFeesUSD: 68249, annualFeesLocalCurrency: 89152, avgAdditionalCostsUSD: 7918.91, localCurrency: 'SGD', localCurrencyExchangeRateToUSD: 1.306 },
    { name: 'Li Po Chun United World College of Hong Kong', annualFeesUSD: 49883, annualFeesLocalCurrency: 389000, avgAdditionalCostsUSD: 2613.76, localCurrency: 'HKD', localCurrencyExchangeRateToUSD: 7.798 },
    { name: 'UWC Robert Bosch College', annualFeesUSD: 41395, annualFeesLocalCurrency: 37480, avgAdditionalCostsUSD: 4073.40, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC Costa Rica', annualFeesUSD: 43000, annualFeesLocalCurrency: 43000, avgAdditionalCostsUSD: 3140, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'Waterford Kamhlaba UWC of Southern Africa', annualFeesUSD: 30925, annualFeesLocalCurrency: 28000, avgAdditionalCostsUSD: 2195.40, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.905 },
    { name: 'UWC-USA', annualFeesUSD: 58970, annualFeesLocalCurrency: 58970, avgAdditionalCostsUSD: 3343.90, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Red Cross Nordic', annualFeesUSD: 85566, annualFeesLocalCurrency: 905000, avgAdditionalCostsUSD: 6078.69, localCurrency: 'NOK', localCurrencyExchangeRateToUSD: 10.577 },
    { name: 'UWC Thailand', annualFeesUSD: 48512, annualFeesLocalCurrency: 1684980, avgAdditionalCostsUSD: 7520.27, localCurrency: 'THB', localCurrencyExchangeRateToUSD: 34.733 },
    { name: 'UWC Dilijan', annualFeesUSD: 44000, annualFeesLocalCurrency: 44000, avgAdditionalCostsUSD: 850, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Maastricht', annualFeesUSD: 39535, annualFeesLocalCurrency: 37450, avgAdditionalCostsUSD: 2649.33, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.947 },
    { name: 'UWC Atlantic', annualFeesUSD: 59106, annualFeesLocalCurrency: 47300, avgAdditionalCostsUSD: 2977.50, localCurrency: 'GBP', localCurrencyExchangeRateToUSD: 0.8 },
    { name: 'UWC Mahindra College', annualFeesUSD: 38200, annualFeesLocalCurrency: 38200, avgAdditionalCostsUSD: 2135, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
    { name: 'UWC Mostar', annualFeesUSD: 24520, annualFeesLocalCurrency: 23000, avgAdditionalCostsUSD: 2445.69, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.938 },
    { name: 'Pearson College UWC', annualFeesUSD: 55430, annualFeesLocalCurrency: 75900, avgAdditionalCostsUSD: 7064.24, localCurrency: 'CAD', localCurrencyExchangeRateToUSD: 1.369 },
    { name: 'UWC ISAK Japan', annualFeesUSD: 49830, annualFeesLocalCurrency: 7555000, avgAdditionalCostsUSD: 5540.35, localCurrency: 'JPY', localCurrencyExchangeRateToUSD: 151.61 },
    { name: 'UWC Changshu China', annualFeesUSD: 53138, annualFeesLocalCurrency: 386000, avgAdditionalCostsUSD: 7108.31, localCurrency: 'CNY', localCurrencyExchangeRateToUSD: 7.264 },
];

const GeneralInfo = ({ formData, handleChange, handleLocalCurrencyChange }) => {
    return (
        <div className="tab-content general-info">
            <h2>General Information</h2>
            <p>Enter the student's country of residence and the UWC school they are applying to (if known).</p>

            <label>
                Student's Country of Residence:
                <input
                    type="text"
                    name="residenceCountry"
                    value={formData.residenceCountry}
                    onChange={handleChange}
                    placeholder="e.g., Mexico, Nigeria, India"
                />
            </label>

            <label>
                Local Currency for Calculations:
                <input
                    type="text"
                    name="localCurrency"
                    value={formData.localCurrency}
                    onChange={handleLocalCurrencyChange}
                    placeholder="e.g., USD, EUR, NGN"
                />
            </label>

            <label>
                Exchange Rate (1 USD to Local Currency):
                <input
                    type="number"
                    name="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={handleChange}
                    placeholder="e.g., 1.0 for USD, 0.95 for EUR"
                    min="0"
                />
            </label>

            <label>
                Target UWC School (Optional):
                <select
                    name="targetSchool"
                    value={formData.targetSchool}
                    onChange={handleChange}
                >
                    <option value="">Select a UWC School</option>
                    {schoolCostsData.map((school) => (
                        <option key={school.name} value={school.name}>
                            {school.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

const ParentInfo = ({ formData, handleChange }) => {
    return (
        <div className="tab-content parent-info">
            <h2>Parent/Guardian Financial Information</h2>
            <p>Enter the total annual income and assets for all parents/guardians, in the **local currency**.</p>

            <label>
                Total Annual Household Income (Pre-tax):
                <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>

            <label>
                Annual Income from Government/State Support (e.g., social welfare):
                <input
                    type="number"
                    name="stateSupportIncome"
                    value={formData.stateSupportIncome}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>

            <label>
                Total Value of Savings and Liquid Assets (Cash, Stocks, etc.):
                <input
                    type="number"
                    name="liquidAssets"
                    value={formData.liquidAssets}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>

            <label>
                Value of Other Major Assets (e.g., properties beyond primary residence, significant business ownership):
                <input
                    type="number"
                    name="majorAssets"
                    value={formData.majorAssets}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>

            <label>
                Annual Loan/Debt Repayments (Total amount paid per year):
                <input
                    type="number"
                    name="annualDebt"
                    value={formData.annualDebt}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>
        </div>
    );
};

const StudentInfo = ({ formData, handleChange }) => {
    return (
        <div className="tab-content student-info">
            <h2>Student & Household Information</h2>
            <p>Provide information about the student and the household's financial context.</p>

            <label>
                Number of Dependents in the Household (Excluding the UWC applicant):
                <input
                    type="number"
                    name="numDependents"
                    value={formData.numDependents}
                    onChange={handleChange}
                    placeholder="e.g., 2, 3"
                    min="0"
                />
            </label>

            <label>
                Number of Dependents Currently in Tertiary Education:
                <input
                    type="number"
                    name="numTertiaryEducation"
                    value={formData.numTertiaryEducation}
                    onChange={handleChange}
                    placeholder="e.g., 0, 1"
                    min="0"
                />
            </label>

            <label>
                Annual Cost of Tertiary Education for Other Dependents:
                <input
                    type="number"
                    name="tertiaryEducationCost"
                    value={formData.tertiaryEducationCost}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>

            <label>
                Approximate Annual Cost of Living for the Household:
                <input
                    type="number"
                    name="annualLivingCost"
                    value={formData.annualLivingCost}
                    onChange={handleChange}
                    placeholder={`in ${formData.localCurrency}`}
                    min="0"
                />
            </label>

            <label>
                Does the student receive a scholarship from their National Committee?
                <select
                    name="hasScholarship"
                    value={formData.hasScholarship}
                    onChange={handleChange}
                >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </label>

            {formData.hasScholarship === 'yes' && (
                <label>
                    Scholarship Coverage Percentage (0-100%):
                    <input
                        type="number"
                        name="scholarshipPercentage"
                        value={formData.scholarshipPercentage}
                        onChange={handleChange}
                        placeholder="e.g., 75"
                        min="0"
                        max="100"
                    />
                </label>
            )}
        </div>
    );
};

const Results = ({ formData, calculations, handleResetForm }) => {
    const selectedSchool = schoolCostsData.find(s => s.name === formData.targetSchool);
    const {
        familyContributionLocal,
        familyContributionUSD,
        totalSchoolCostUSD,
        totalSchoolCostLocal,
        scholarshipNeedUSD,
        scholarshipNeedLocal,
        liquidityContribution,
        assetContribution,
        incomeContribution,
        disposableIncome,
        annualHouseholdCostPercentage,
        monthlyContributionUSD,
        monthlyContributionLocal,
    } = calculations;

    return (
        <div className="tab-content results">
            <h2>Financial Need Assessment Results</h2>

            {selectedSchool && (
                <div className="school-cost-summary">
                    <h3>{selectedSchool.name} Costs (Estimated Two-Year Total)</h3>
                    <p><strong>Annual Fee (USD):</strong> ${selectedSchool.annualFeesUSD.toLocaleString()}</p>
                    <p><strong>Avg. Annual Additional Costs (USD):</strong> ${selectedSchool.avgAdditionalCostsUSD.toFixed(2).toLocaleString()}</p>
                    <p><strong>Total Estimated Annual Cost (USD):</strong> ${(selectedSchool.annualFeesUSD + selectedSchool.avgAdditionalCostsUSD).toFixed(2).toLocaleString()}</p>
                    <p><strong>Total Two-Year Cost (USD):</strong> ${totalSchoolCostUSD.toLocaleString()}</p>
                    <p className="local-cost-note">
                        (Approximate Two-Year Cost in {formData.localCurrency}: {totalSchoolCostLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })})
                    </p>
                </div>
            )}

            <div className="contribution-summary">
                <h3>Estimated Annual Family Contribution</h3>
                <p><strong>Annual Contribution (USD):</strong> ${familyContributionUSD.toLocaleString()}</p>
                <p className="local-cost-note">
                    (In {formData.localCurrency}: {familyContributionLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })})
                </p>
                <p><strong>Monthly Contribution (USD):</strong> ${monthlyContributionUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</p>
                <p className="local-cost-note">
                    (In {formData.localCurrency}: {monthlyContributionLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })})
                </p>
            </div>

            <div className="scholarship-summary">
                <h3>Estimated Annual Scholarship Need</h3>
                {selectedSchool ? (
                    <>
                        <p><strong>Scholarship Need (USD):</strong> ${scholarshipNeedUSD.toLocaleString()}</p>
                        <p className="local-cost-note">
                            (In {formData.localCurrency}: {scholarshipNeedLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })})
                        </p>
                    </>
                ) : (
                    <p>Please select a **Target UWC School** in the General Info tab to calculate scholarship need.</p>
                )}
            </div>

            <hr />

            <div className="details-section">
                <h3>Contribution Breakdown (Annual in {formData.localCurrency})</h3>
                <p>Contribution from Savings/Liquid Assets: {liquidityContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</p>
                <p>Contribution from Other Major Assets: {assetContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</p>
                <p>Contribution from Disposable Income: {incomeContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</p>
                <p>Total Estimated Annual Contribution: {familyContributionLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</p>
            </div>

            <div className="details-section">
                <h3>Household Income Details (Annual in {formData.localCurrency})</h3>
                <p>Disposable Income (before UWC contribution): {disposableIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</p>
                <p>Annual Household Living Cost as % of Income: {annualHouseholdCostPercentage.toFixed(2)}%</p>
            </div>

            <p className="disclaimer">
                * This is an **ESTIMATE** based on publicly available data and a simplified financial model. The actual family contribution is determined by the UWC National Committee's official financial assessment process, which considers many more factors.
            </p>

            <div className="reset-button-container">
                <button onClick={handleResetForm} className="reset-button">Start New Assessment</button>
            </div>
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('general');

    const initialFormData = {
        residenceCountry: '',
        localCurrency: 'USD',
        exchangeRate: 1.0,
        targetSchool: '',
        annualIncome: '',
        stateSupportIncome: '',
        liquidAssets: '',
        majorAssets: '',
        annualDebt: '',
        numDependents: 0,
        numTertiaryEducation: 0,
        tertiaryEducationCost: '',
        annualLivingCost: '',
        hasScholarship: 'no',
        scholarshipPercentage: 0,
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleLocalCurrencyChange = (e) => {
        const { value } = e.target;
        // Auto-set exchange rate to 1.0 if USD is entered
        if (value.toUpperCase() === 'USD') {
            setFormData(prev => ({
                ...prev,
                localCurrency: value,
                exchangeRate: 1.0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                localCurrency: value
            }));
        }
    };

    const handleChange = (e) => {
        let { name, value, type } = e.target;

        if (type === 'number') {
            // Convert to number, but keep empty string for empty input
            value = value === '' ? '' : Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Auto-update scholarship percentage if hasScholarship changes
    useEffect(() => {
        if (formData.hasScholarship === 'no') {
            setFormData(prev => ({
                ...prev,
                scholarshipPercentage: 0
            }));
        }
    }, [formData.hasScholarship]);

    const handleResetForm = () => {
        setFormData(initialFormData);
        setActiveTab('general');
    };

    const calculations = useMemo(() => {
        const income = Number(formData.annualIncome) || 0;
        const stateSupport = Number(formData.stateSupportIncome) || 0;
        const totalIncome = income + stateSupport;
        const liquidAssets = Number(formData.liquidAssets) || 0;
        const majorAssets = Number(formData.majorAssets) || 0;
        const annualDebt = Number(formData.annualDebt) || 0;
        const tertiaryCost = Number(formData.tertiaryEducationCost) || 0;
        const livingCost = Number(formData.annualLivingCost) || 0;
        const dependents = Number(formData.numDependents) || 0;
        const tertiaryDependents = Number(formData.numTertiaryEducation) || 0;
        const exchangeRate = Number(formData.exchangeRate) || 1.0;
        const scholarshipPercent = Number(formData.scholarshipPercentage) || 0;

        // --- Core Calculation Logic ---

        // 1. Calculate Disposable Income (Simplified - before UWC contribution)
        // Adjust income for necessary costs, debt, and other dependents' education
        // A common formula might be: Income - Living Cost - Debt Repayments - Other Education Costs

        const netIncome = totalIncome - annualDebt - tertiaryCost;
        const disposableIncome = Math.max(0, netIncome - livingCost);

        // 2. Family Contribution from Different Sources (Approximation)

        // a. Contribution from Liquid Assets (e.g., 5-10% of total liquid assets)
        const LIQUIDITY_CONTRIBUTION_RATE = 0.075; // 7.5%
        const liquidityContribution = liquidAssets * LIQUIDITY_CONTRIBUTION_RATE;

        // b. Contribution from Major Assets (e.g., 2-5% of total major assets)
        const MAJOR_ASSET_CONTRIBUTION_RATE = 0.03; // 3%
        const assetContribution = majorAssets * MAJOR_ASSET_CONTRIBUTION_RATE;

        // c. Contribution from Disposable Income (Progressive rate based on disposable income level)
        let incomeContributionRate = 0;
        if (disposableIncome > 500000) {
            incomeContributionRate = 0.3; // 30%
        } else if (disposableIncome > 200000) {
            incomeContributionRate = 0.2; // 20%
        } else if (disposableIncome > 50000) {
            incomeContributionRate = 0.1; // 10%
        } else if (disposableIncome > 0) {
            incomeContributionRate = 0.05; // 5%
        }

        const incomeContribution = disposableIncome * incomeContributionRate;

        // 3. Total Estimated Annual Family Contribution (Local Currency)
        // Add a factor for number of non-UWC dependents (e.g., reduce contribution by a small percentage for each dependent)
        const DEPENDENT_ADJUSTMENT_FACTOR = 1 - (Math.min(dependents + tertiaryDependents, 4) * 0.02); // Max 8% reduction for 4+ dependents
        const rawFamilyContributionLocal = (liquidityContribution + assetContribution + incomeContribution) * DEPENDENT_ADJUSTMENT_FACTOR;

        // Cap contribution to not exceed a reasonable percentage of Total Income (e.g., 30%)
        const MAX_INCOME_CONTRIBUTION_RATE = 0.3;
        const familyContributionLocal = Math.min(
            rawFamilyContributionLocal,
            totalIncome * MAX_INCOME_CONTRIBUTION_RATE // Max 30% of total income
        );


        // --- Conversion to USD ---
        const familyContributionUSD = familyContributionLocal / exchangeRate;
        const monthlyContributionLocal = familyContributionLocal / 12;
        const monthlyContributionUSD = familyContributionUSD / 12;

        // --- School Cost and Scholarship Need ---
        let totalSchoolCostUSD = 0;
        let totalSchoolCostLocal = 0;
        let scholarshipNeedUSD = 0;
        let scholarshipNeedLocal = 0;

        const selectedSchool = schoolCostsData.find(s => s.name === formData.targetSchool);

        if (selectedSchool) {
            // Annual cost is Fees + Additional Costs (in USD)
            const annualSchoolCostUSD = selectedSchool.annualFeesUSD + selectedSchool.avgAdditionalCostsUSD;
            // Two-year total cost
            totalSchoolCostUSD = annualSchoolCostUSD * 2;
            totalSchoolCostLocal = totalSchoolCostUSD * exchangeRate; // Convert to local currency

            // The family contribution is an ANNUAL contribution, so the two-year contribution is:
            const familyTwoYearContributionUSD = familyContributionUSD * 2;

            // Calculate need before National Committee scholarship
            const rawScholarshipNeedUSD = totalSchoolCostUSD - familyTwoYearContributionUSD;

            // Apply National Committee scholarship (if applicable)
            let actualFamilyContributionUSD = familyTwoYearContributionUSD;

            if (formData.hasScholarship === 'yes' && scholarshipPercent > 0) {
                // If a scholarship is already assigned, the new contribution should be based on the required family contribution.
                // Required Family Contribution = Total Cost * (1 - Scholarship%)
                const requiredFamilyContributionUSD = totalSchoolCostUSD * (1 - (scholarshipPercent / 100));

                // The final contribution is the maximum of the calculated contribution and the required contribution
                // based on the awarded scholarship, but can't exceed the total cost.
                actualFamilyContributionUSD = Math.max(requiredFamilyContributionUSD, familyTwoYearContributionUSD);
                actualFamilyContributionUSD = Math.min(actualFamilyContributionUSD, totalSchoolCostUSD);

                // Scholarship need is simply the amount covered by the scholarship (which should be at least scholarship % of total cost)
                // and the *remaining* amount not covered by the family contribution.
                scholarshipNeedUSD = totalSchoolCostUSD - actualFamilyContributionUSD;
            } else {
                // If no scholarship is specified, the scholarship need is the remaining cost after family contribution.
                scholarshipNeedUSD = Math.max(0, rawScholarshipNeedUSD);
            }

            scholarshipNeedLocal = scholarshipNeedUSD * exchangeRate;
        }

        // --- Other Metrics ---
        const annualHouseholdCostPercentage = totalIncome > 0 ? (livingCost / totalIncome) * 100 : 0;

        return {
            familyContributionLocal: familyContributionLocal,
            familyContributionUSD: familyContributionUSD,
            totalSchoolCostUSD: totalSchoolCostUSD,
            totalSchoolCostLocal: totalSchoolCostLocal,
            scholarshipNeedUSD: scholarshipNeedUSD,
            scholarshipNeedLocal: scholarshipNeedLocal,
            liquidityContribution: liquidityContribution,
            assetContribution: assetContribution,
            incomeContribution: incomeContribution,
            disposableIncome: disposableIncome,
            annualHouseholdCostPercentage: annualHouseholdCostPercentage,
            monthlyContributionUSD: monthlyContributionUSD,
            monthlyContributionLocal: monthlyContributionLocal,
        };
    }, [formData]);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralInfo formData={formData} handleChange={handleChange} handleLocalCurrencyChange={handleLocalCurrencyChange} />;
            case 'parent':
                return <ParentInfo formData={formData} handleChange={handleChange} />;
            case 'student':
                return <StudentInfo formData={formData} handleChange={handleChange} />;
            case 'results':
                return <Results formData={formData} calculations={calculations} handleResetForm={handleResetForm} />;
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