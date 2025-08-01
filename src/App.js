import React, { useState, useMemo, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css'; // Import the new CSS file

// Embedded data from "FNA Tool.xlsx - Totals school costs.csv"
const schoolCostsData = [
  { name: 'UWC South East Asia', annualFeesUSD: 68249, avgAdditionalCostsUSD: 7918.91 },
  { name: 'Li Po Chun United World College of Hong Kong', annualFeesUSD: 49883, avgAdditionalCostsUSD: 2613.76 },
  { name: 'UWC Robert Bosch College', annualFeesUSD: 41395, avgAdditionalCostsUSD: 4073.40 },
  { name: 'UWC Costa Rica', annualFeesUSD: 43000, avgAdditionalCostsUSD: 3140 },
  { name: 'Waterford Kamhlaba UWC of Southern Africa', annualFeesUSD: 30925, avgAdditionalCostsUSD: 2270.62 },
  { name: 'UWC Dilijan', annualFeesUSD: 44000, avgAdditionalCostsUSD: 800 },
  { name: 'UWC Atlantic', annualFeesUSD: 42000, avgAdditionalCostsUSD: 3800 },
  { name: 'UWC Mahindra College', annualFeesUSD: 40000, avgAdditionalCostsUSD: 3000 },
  { name: 'UWC Pearson College', annualFeesUSD: 45000, avgAdditionalCostsUSD: 4200 },
  { name: 'UWC Changshu China', annualFeesUSD: 46000, avgAdditionalCostsUSD: 3500 },
  { name: 'UWC Red Cross Nordic', annualFeesUSD: 41000, avgAdditionalCostsUSD: 3000 },
  { name: 'UWC Adriatic', annualFeesUSD: 39000, avgAdditionalCostsUSD: 3200 },
  { name: 'UWC ISAK Japan', annualFeesUSD: 48000, avgAdditionalCostsUSD: 4000 },
  { name: 'UWC Thailand', annualFeesUSD: 43000, avgAdditionalCostsUSD: 3500 },
  { name: 'UWC Mostar', annualFeesUSD: 38000, avgAdditionalCostsUSD: 2800 },
  { name: 'UWC Maastricht', annualFeesUSD: 40000, avgAdditionalCostsUSD: 3000 },
  { name: 'UWC East Africa', annualFeesUSD: 47000, avgAdditionalCostsUSD: 4000 },
  { name: 'UWC USA', annualFeesUSD: 60000, avgAdditionalCostsUSD: 5000 },
];

// Embedded data from "FNA Tool.xlsx - Currency list.csv"
const currencyList = [
  { abbr: 'USD', symbol: '$' },
  { abbr: 'KES', symbol: 'KSh' },
  { abbr: 'INR', symbol: '₹' },
  { abbr: 'EUR', symbol: '€' },
  { abbr: 'GBP', symbol: '£' },
  { abbr: 'JPY', symbol: '¥' },
  { abbr: 'CAD', symbol: '$' },
  { abbr: 'AUD', symbol: '$' },
  { abbr: 'SGD', symbol: 'S$' },
  { abbr: 'HKD', symbol: 'HK$' },
  { abbr: 'CHF', symbol: 'CHF' },
  { abbr: 'CNY', symbol: '¥' },
  { abbr: 'BRL', symbol: 'R$' },
  { abbr: 'ZAR', symbol: 'R' },
  { abbr: 'NGN', symbol: '₦' },
  { abbr: 'EGP', symbol: 'E£' },
  { abbr: 'MXN', symbol: '$' },
  { abbr: 'RUB', symbol: '₽' },
  { abbr: 'TRY', symbol: '₺' },
  { abbr: 'PKR', symbol: '₨' },
  { abbr: 'BDT', symbol: '৳' },
  { abbr: 'PHP', symbol: '₱' },
  { abbr: 'IDR', symbol: 'Rp' },
  { abbr: 'THB', symbol: '฿' },
  { abbr: 'VND', symbol: '₫' },
  { abbr: 'PLN', symbol: 'zł' },
  { abbr: 'SEK', symbol: 'kr' },
  { abbr: 'DKK', symbol: 'kr' },
  { abbr: 'NOK', symbol: 'kr' },
  { abbr: 'CZK', symbol: 'Kč' },
  { abbr: 'HUF', symbol: 'Ft' },
  { abbr: 'ILS', symbol: '₪' },
  { abbr: 'KRW', symbol: '₩' },
];

// --- Helper Functions moved outside the component to fix the eslint error ---

// Helper function to get a number from a value, defaulting to 0
const getNum = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// Helper function to convert NC currency to USD
const convertNcToUsd = (valueInNcCurrency, exchangeRate) => {
  if (exchangeRate <= 0) {
    return 0;
  }
  return getNum(valueInNcCurrency) / getNum(exchangeRate);
};

// --- End of Helper Functions ---

function App() {
  const [formData, setFormData] = useState({
    ncCurrencySymbol: '',
    exchangeRateToUSD: 0,
    exchangeRateDate: '',
    annualReturnOnAssets: 0.025,

    // Page 1: Family Income & Assets
    parentsLiveSameHome: true,
    pg1NumberIndependentAdults: 1,
    pg1NumberFinancialDependents: 0,
    pg1AnnualIncomePrimaryParent: 0,
    pg1AnnualIncomeOtherParent: 0,
    pg1AnnualBenefits: 0,
    pg1OtherAnnualIncome: 0,
    pg1CashSavings: 0,
    pg1OtherAssets: 0,
    pg1HomeMarketValue: 0,
    pg1HomeOutstandingMortgage: 0,
    pg1TotalOutstandingDebt: 0,
    pg1AnnualDebtPayment: 0,
    otherPropertiesNetIncome: 0,
    assetsAnotherCountryNetIncome: 0,

    // Page 2: Student & Family Expenses
    pg2StudentAnnualIncome: 0,
    pg2StudentCashSavings: 0,
    pg2StudentOtherAssets: 0,
    pg2ParentsAnnualDiscretionaryExpenditure: 0,
    pg2OtherHouseholdCosts: 0,
    pg2TotalOutstandingDebt: 0,
    pg2AnnualDebtPayment: 0,
    annualLoanRepayment: 0,
    familyAnticipatedAnnualSavings: 0,
    potentialLoanAmount: 0,

    // Page 3: UWC Specifics
    annualTravelCostUSD: 0,
    ncScholarshipProvidedTwoYearsUSD: 0,
  });

  const [errors, setErrors] = useState({});
  const pdfContentRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;
    if (type === 'number') {
      newValue = parseFloat(value);
      if (isNaN(newValue)) {
        newValue = '';
      }
    } else if (type === 'checkbox') {
      newValue = checked;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const allSchoolResults = useMemo(() => {
    const {
      ncCurrencySymbol,
      exchangeRateToUSD,
      exchangeRateDate,
      annualReturnOnAssets,
      parentsLiveSameHome,
      pg1NumberIndependentAdults,
      pg1NumberFinancialDependents,
      pg1AnnualIncomePrimaryParent,
      pg1AnnualIncomeOtherParent,
      pg1AnnualBenefits,
      pg1OtherAnnualIncome,
      pg1CashSavings,
      pg1OtherAssets,
      pg1HomeMarketValue,
      pg1HomeOutstandingMortgage,
      pg1AnnualDebtPayment,
      otherPropertiesNetIncome,
      assetsAnotherCountryNetIncome,
      pg2StudentAnnualIncome,
      pg2StudentCashSavings,
      pg2StudentOtherAssets,
      pg2ParentsAnnualDiscretionaryExpenditure,
      pg2OtherHouseholdCosts,
      pg2AnnualDebtPayment,
      annualLoanRepayment,
      familyAnticipatedAnnualSavings,
      potentialLoanAmount,
      annualTravelCostUSD,
      ncScholarshipProvidedTwoYearsUSD,
    } = formData;

    if (getNum(exchangeRateToUSD) <= 0) {
      return {
        ncCurrencySymbol,
        exchangeRateToUSD,
        exchangeRateDate,
        totalAnnualIncome: '0.00',
        totalCashAssets: '0.00',
        annualReturnOnFamilyAssets: '0.00',
        homeEquity: '0.00',
        annualHomeEquityContribution: '0.00',
        totalAssetsContribution: '0.00',
        totalAnnualFixedExpenditure: '0.00',
        discretionaryExpenditureForFormula3: '0.00',
        formula1_familyContributionUSD: '0.00',
        formula2_studentContributionUSD: '0.00',
        formula3_estimateCostEducateStudentHome: '0.00',
        uwcFamilyContributionRequiredUSD: '0.00',
        familyAnticipatedAnnualSavings: '0.00',
        potentialLoanAmount: '0.00',
        allSchoolResults: schoolCostsData.map(school => ({
          schoolName: school.name,
          schoolAnnualFeesUSD: school.annualFeesUSD.toFixed(2),
          schoolAvgAdditionalCostsUSD: school.avgAdditionalCostsUSD.toFixed(2),
          totalGrossAnnualCostOfAttendanceUSD: '0.00',
          totalNeedUSD: '0.00',
          uwcNeedsBasedScholarshipUSD: '0.00',
          uwcNeedsBasedScholarshipPercentage: '0.00',
          netUWCAnnualFeesUSD: '0.00',
          suggestedFamilyContributionTwoYearsUSD: '0.00',
          combinedNcAndFamilyContributionTwoYearsUSD: '0.00',
          totalCostOfAttendanceTwoYearsUSD: '0.00',
          contributionStatus: 'N/A',
          contributionClassName: 'status-na',
          amountPayableBySchoolAnnual: '0.00',
          amountPayableByFamilyAnnual: '0.00',
          percentagePayableBySchool: '0.00',
          percentagePayableByFamily: '0.00',
        })),
      };
    }

    const totalHouseholdMembers = getNum(pg1NumberIndependentAdults) + getNum(pg1NumberFinancialDependents);

    const ncIncomePrimaryParentUSD = convertNcToUsd(pg1AnnualIncomePrimaryParent, exchangeRateToUSD);
    const ncIncomeOtherParentUSD = convertNcToUsd(pg1AnnualIncomeOtherParent, exchangeRateToUSD);
    const ncAnnualBenefitsUSD = convertNcToUsd(pg1AnnualBenefits, exchangeRateToUSD);
    const ncOtherAnnualIncomeUSD = convertNcToUsd(pg1OtherAnnualIncome, exchangeRateToUSD);
    const ncCashSavingsUSD = convertNcToUsd(pg1CashSavings, exchangeRateToUSD);
    const ncOtherAssetsUSD = convertNcToUsd(pg1OtherAssets, exchangeRateToUSD);
    const ncOtherPropertiesNetIncomeUSD = convertNcToUsd(otherPropertiesNetIncome, exchangeRateToUSD);
    const ncAssetsAnotherCountryNetIncomeUSD = convertNcToUsd(assetsAnotherCountryNetIncome, exchangeRateToUSD);

    const ncStudentAnnualIncomeUSD = convertNcToUsd(pg2StudentAnnualIncome, exchangeRateToUSD);
    const ncStudentCashSavingsUSD = convertNcToUsd(pg2StudentCashSavings, exchangeRateToUSD);
    const ncStudentOtherAssetsUSD = convertNcToUsd(pg2StudentOtherAssets, exchangeRateToUSD);

    const ncParentsAnnualDiscretionaryExpenditureUSD = convertNcToUsd(pg2ParentsAnnualDiscretionaryExpenditure, exchangeRateToUSD);
    const ncOtherHouseholdCostsUSD = convertNcToUsd(pg2OtherHouseholdCosts, exchangeRateToUSD);

    const pg1AnnualDebtPaymentUSD = convertNcToUsd(pg1AnnualDebtPayment, exchangeRateToUSD);
    const pg2AnnualDebtPaymentUSD = convertNcToUsd(pg2AnnualDebtPayment, exchangeRateToUSD);
    const annualLoanRepaymentUSD = convertNcToUsd(annualLoanRepayment, exchangeRateToUSD);

    const totalAnnualIncome =
      ncIncomePrimaryParentUSD +
      ncIncomeOtherParentUSD +
      ncAnnualBenefitsUSD +
      ncOtherAnnualIncomeUSD +
      ncOtherPropertiesNetIncomeUSD +
      ncAssetsAnotherCountryNetIncomeUSD;

    const totalCashAssets = ncCashSavingsUSD + ncOtherAssetsUSD;
    const annualReturnOnFamilyAssets = totalCashAssets * getNum(annualReturnOnAssets);

    const homeEquity = Math.max(0, getNum(pg1HomeMarketValue) - getNum(pg1HomeOutstandingMortgage));
    const annualHomeEquityContribution = homeEquity * 0.02;

    const totalAssetsContribution = annualReturnOnFamilyAssets + annualHomeEquityContribution;

    const totalAnnualFixedExpenditure = pg1AnnualDebtPaymentUSD + pg2AnnualDebtPaymentUSD + annualLoanRepaymentUSD;

    const discretionaryExpenditureForFormula3 = ncParentsAnnualDiscretionaryExpenditureUSD + (parentsLiveSameHome ? 0 : ncOtherHouseholdCostsUSD);

    const formula1_familyContributionUSD = Math.max(
      0,
      totalAnnualIncome - totalAnnualFixedExpenditure + totalAssetsContribution
    );

    const formula2_studentContributionUSD =
      ncStudentAnnualIncomeUSD +
      (ncStudentCashSavingsUSD * 0.1) +
      (ncStudentOtherAssetsUSD * 0.05);

    const costHome = 0;
    const formula3_estimateCostEducateStudentHome =
      (totalHouseholdMembers > 0 ? discretionaryExpenditureForFormula3 / totalHouseholdMembers : 0) + costHome;

    const uwcFamilyContributionRequiredUSD = Math.max(
      0,
      formula1_familyContributionUSD,
      formula2_studentContributionUSD,
      formula3_estimateCostEducateStudentHome
    );

    const calculatedSchoolResults = schoolCostsData.map(school => {
      const schoolAnnualFeesUSD = school.annualFeesUSD;
      const schoolAvgAdditionalCostsUSD = school.avgAdditionalCostsUSD;

      const totalGrossAnnualCostOfAttendanceUSD = getNum(schoolAnnualFeesUSD) + getNum(schoolAvgAdditionalCostsUSD) + getNum(annualTravelCostUSD);

      const totalNeedUSD = Math.max(0, totalGrossAnnualCostOfAttendanceUSD - uwcFamilyContributionRequiredUSD);
      const uwcNeedsBasedScholarshipUSD = totalNeedUSD;

      const uwcNeedsBasedScholarshipPercentage =
        totalGrossAnnualCostOfAttendanceUSD > 0
          ? (uwcNeedsBasedScholarshipUSD / totalGrossAnnualCostOfAttendanceUSD) * 100
          : 0;

      const netUWCAnnualFeesUSD = Math.max(0, totalGrossAnnualCostOfAttendanceUSD - uwcNeedsBasedScholarshipUSD);

      const suggestedFamilyContributionTwoYearsUSD = Math.max(0, (uwcFamilyContributionRequiredUSD * 2) - ncScholarshipProvidedTwoYearsUSD);
      const combinedNcAndFamilyContributionTwoYearsUSD = getNum(ncScholarshipProvidedTwoYearsUSD) + suggestedFamilyContributionTwoYearsUSD;
      const totalCostOfAttendanceTwoYearsUSD = totalGrossAnnualCostOfAttendanceUSD * 2;
      
      let contributionStatus = '';
      let contributionClassName = '';
      const shortfall = totalCostOfAttendanceTwoYearsUSD - combinedNcAndFamilyContributionTwoYearsUSD;

      if (shortfall <= 0) {
        contributionStatus = 'Contribution Meets or Exceeds Cost';
        contributionClassName = 'status-green'; 
      } else if (shortfall <= 10000) {
        contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
        contributionClassName = 'status-orange'; 
      } else {
        contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
        contributionClassName = 'status-red'; 
      }

      const amountPayableBySchoolAnnual = uwcNeedsBasedScholarshipUSD;
      const amountPayableByFamilyAnnual = uwcFamilyContributionRequiredUSD;

      const percentagePayableBySchool =
        totalGrossAnnualCostOfAttendanceUSD > 0
          ? (amountPayableBySchoolAnnual / totalGrossAnnualCostOfAttendanceUSD) * 100
          : 0;

      const percentagePayableByFamily =
        totalGrossAnnualCostOfAttendanceUSD > 0
          ? (amountPayableByFamilyAnnual / totalGrossAnnualCostOfAttendanceUSD) * 100
          : 0;

      return {
        schoolName: school.name,
        schoolAnnualFeesUSD: schoolAnnualFeesUSD.toFixed(2),
        schoolAvgAdditionalCostsUSD: schoolAvgAdditionalCostsUSD.toFixed(2),
        totalGrossAnnualCostOfAttendanceUSD: totalGrossAnnualCostOfAttendanceUSD.toFixed(2),
        totalNeedUSD: totalNeedUSD.toFixed(2),
        uwcNeedsBasedScholarshipUSD: uwcNeedsBasedScholarshipUSD.toFixed(2),
        uwcNeedsBasedScholarshipPercentage: uwcNeedsBasedScholarshipPercentage.toFixed(2),
        netUWCAnnualFeesUSD: netUWCAnnualFeesUSD.toFixed(2),
        suggestedFamilyContributionTwoYearsUSD: suggestedFamilyContributionTwoYearsUSD.toFixed(2),
        combinedNcAndFamilyContributionTwoYearsUSD: combinedNcAndFamilyContributionTwoYearsUSD.toFixed(2),
        totalCostOfAttendanceTwoYearsUSD: totalCostOfAttendanceTwoYearsUSD.toFixed(2),
        contributionStatus,
        contributionClassName,
        amountPayableBySchoolAnnual: amountPayableBySchoolAnnual.toFixed(2),
        amountPayableByFamilyAnnual: amountPayableByFamilyAnnual.toFixed(2),
        percentagePayableBySchool: percentagePayableBySchool.toFixed(2),
        percentagePayableByFamily: percentagePayableByFamily.toFixed(2),
      };
    });

    return {
      ncCurrencySymbol,
      exchangeRateToUSD,
      exchangeRateDate,
      totalAnnualIncome: totalAnnualIncome.toFixed(2),
      totalCashAssets: totalCashAssets.toFixed(2),
      annualReturnOnFamilyAssets: annualReturnOnFamilyAssets.toFixed(2),
      homeEquity: homeEquity.toFixed(2),
      annualHomeEquityContribution: annualHomeEquityContribution.toFixed(2),
      totalAssetsContribution: totalAssetsContribution.toFixed(2),
      totalAnnualFixedExpenditure: totalAnnualFixedExpenditure.toFixed(2),
      discretionaryExpenditureForFormula3: discretionaryExpenditureForFormula3.toFixed(2),
      formula1_familyContributionUSD: formula1_familyContributionUSD.toFixed(2),
      formula2_studentContributionUSD: formula2_studentContributionUSD.toFixed(2),
      formula3_estimateCostEducateStudentHome: formula3_estimateCostEducateStudentHome.toFixed(2),
      uwcFamilyContributionRequiredUSD: uwcFamilyContributionRequiredUSD.toFixed(2),
      familyAnticipatedAnnualSavings: getNum(familyAnticipatedAnnualSavings).toFixed(2),
      potentialLoanAmount: getNum(potentialLoanAmount).toFixed(2),
      allSchoolResults: calculatedSchoolResults,
    };
  }, [formData]);

  const handleCalculate = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.exchangeRateToUSD <= 0) {
      newErrors.exchangeRateToUSD = 'Exchange Rate must be greater than 0.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      ncCurrencySymbol: '',
      exchangeRateToUSD: 0,
      exchangeRateDate: '',
      annualReturnOnAssets: 0.025,

      pg1NumberIndependentAdults: 1,
      pg1NumberFinancialDependents: 0,
      parentsLiveSameHome: true,
      pg1AnnualIncomePrimaryParent: 0,
      pg1AnnualIncomeOtherParent: 0,
      pg1AnnualBenefits: 0,
      pg1OtherAnnualIncome: 0,
      pg1CashSavings: 0,
      pg1OtherAssets: 0,
      pg1HomeMarketValue: 0,
      pg1HomeOutstandingMortgage: 0,
      pg1TotalOutstandingDebt: 0,
      pg1AnnualDebtPayment: 0,
      otherPropertiesNetIncome: 0,
      assetsAnotherCountryNetIncome: 0,

      pg2StudentAnnualIncome: 0,
      pg2StudentCashSavings: 0,
      pg2StudentOtherAssets: 0,
      pg2ParentsAnnualDiscretionaryExpenditure: 0,
      pg2OtherHouseholdCosts: 0,
      pg2TotalOutstandingDebt: 0,
      pg2AnnualDebtPayment: 0,
      annualLoanRepayment: 0,
      familyAnticipatedAnnualSavings: 0,
      potentialLoanAmount: 0,

      annualTravelCostUSD: 0,
      ncScholarshipProvidedTwoYearsUSD: 0,
    });
    setErrors({});
  };

  const generateNumberOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  const handleDownloadPdf = () => {
    const content = pdfContentRef.current;

    if (!content) {
      console.error("PDF content element not found. Cannot generate PDF.");
      return;
    }

    const options = {
      margin: 10,
      filename: `FNA_Report_${new Date().getFullYear()}_${(new Date().getMonth() + 1).toString().padStart(2, '0')}_${new Date().getDate().toString().padStart(2, '0')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(content).set(options).save();
  };

  return (
    <div className="app-container">
      <h1 className="main-title">Financial Need Analysis Form</h1>
      <form onSubmit={handleCalculate} className="form-container">
        <section className="form-section">
          <h2 className="section-title">General Information</h2>
          <div className="form-group">
            <label htmlFor="ncCurrencySymbol">National Currency Symbol:</label>
            <select
              id="ncCurrencySymbol"
              name="ncCurrencySymbol"
              value={formData.ncCurrencySymbol}
              onChange={handleChange}
            >
              <option value="">Select Currency</option>
              {currencyList.map(currency => (
                <option key={currency.abbr} value={currency.abbr}>
                  {currency.abbr} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exchangeRateToUSD">
              Exchange Rate (1 USD = X NC Currency):
              {errors.exchangeRateToUSD && <span className="error-message">{errors.exchangeRateToUSD}</span>}
            </label>
            <input
              type="number"
              id="exchangeRateToUSD"
              name="exchangeRateToUSD"
              min="0.000001"
              step="0.000001"
              value={formData.exchangeRateToUSD}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="exchangeRateDate">Exchange Rate Date:</label>
            <input
              type="date"
              id="exchangeRateDate"
              name="exchangeRateDate"
              value={formData.exchangeRateDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="annualReturnOnAssets">Annual Return on Assets (%):</label>
            <input
              type="number"
              id="annualReturnOnAssets"
              name="annualReturnOnAssets"
              min="0"
              step="0.01"
              value={formData.annualReturnOnAssets * 100}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, value: parseFloat(e.target.value) / 100 } })}
            />
          </div>
        </section>

        <section className="form-section">
          <h2 className="section-title">Page 1: Family Income & Assets ({formData.ncCurrencySymbol})</h2>
          <div className="form-group checkbox-group">
            <label htmlFor="parentsLiveSameHome">Parents live in the same home?</label>
            <input
              type="checkbox"
              id="parentsLiveSameHome"
              name="parentsLiveSameHome"
              checked={formData.parentsLiveSameHome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1NumberIndependentAdults">Number of Independent Adults:</label>
            <select
              id="pg1NumberIndependentAdults"
              name="pg1NumberIndependentAdults"
              value={formData.pg1NumberIndependentAdults}
              onChange={handleChange}
            >
              {generateNumberOptions(0, 5)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pg1NumberFinancialDependents">Number of Financial Dependents (excluding student):</label>
            <select
              id="pg1NumberFinancialDependents"
              name="pg1NumberFinancialDependents"
              value={formData.pg1NumberFinancialDependents}
              onChange={handleChange}
            >
              {generateNumberOptions(0, 10)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pg1AnnualIncomePrimaryParent">Annual Income (Primary Parent):</label>
            <input
              type="number"
              id="pg1AnnualIncomePrimaryParent"
              name="pg1AnnualIncomePrimaryParent"
              min="0"
              step="0.01"
              value={formData.pg1AnnualIncomePrimaryParent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1AnnualIncomeOtherParent">Annual Income (Other Parent):</label>
            <input
              type="number"
              id="pg1AnnualIncomeOtherParent"
              name="pg1AnnualIncomeOtherParent"
              min="0"
              step="0.01"
              value={formData.pg1AnnualIncomeOtherParent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1AnnualBenefits">Annual Benefits:</label>
            <input
              type="number"
              id="pg1AnnualBenefits"
              name="pg1AnnualBenefits"
              min="0"
              step="0.01"
              value={formData.pg1AnnualBenefits}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1OtherAnnualIncome">Other Annual Income:</label>
            <input
              type="number"
              id="pg1OtherAnnualIncome"
              name="pg1OtherAnnualIncome"
              min="0"
              step="0.01"
              value={formData.pg1OtherAnnualIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1CashSavings">Cash Savings:</label>
            <input
              type="number"
              id="pg1CashSavings"
              name="pg1CashSavings"
              min="0"
              step="0.01"
              value={formData.pg1CashSavings}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1OtherAssets">Other Assets (e.g., investments, non-retirement accounts):</label>
            <input
              type="number"
              id="pg1OtherAssets"
              name="pg1OtherAssets"
              min="0"
              step="0.01"
              value={formData.pg1OtherAssets}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1HomeMarketValue">Home Market Value:</label>
            <input
              type="number"
              id="pg1HomeMarketValue"
              name="pg1HomeMarketValue"
              min="0"
              step="0.01"
              value={formData.pg1HomeMarketValue}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1HomeOutstandingMortgage">Home Outstanding Mortgage:</label>
            <input
              type="number"
              id="pg1HomeOutstandingMortgage"
              name="pg1HomeOutstandingMortgage"
              min="0"
              step="0.01"
              value={formData.pg1HomeOutstandingMortgage}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1TotalOutstandingDebt">Total Outstanding Debt (Parent 1):</label>
            <input
              type="number"
              id="pg1TotalOutstandingDebt"
              name="pg1TotalOutstandingDebt"
              min="0"
              step="0.01"
              value={formData.pg1TotalOutstandingDebt}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1AnnualDebtPayment">Annual Debt Payment (Parent 1):</label>
            <input
              type="number"
              id="pg1AnnualDebtPayment"
              name="pg1AnnualDebtPayment"
              min="0"
              step="0.01"
              value={formData.pg1AnnualDebtPayment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="otherPropertiesNetIncome">Net Income from Other Properties:</label>
            <input
              type="number"
              id="otherPropertiesNetIncome"
              name="otherPropertiesNetIncome"
              step="0.01"
              value={formData.otherPropertiesNetIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="assetsAnotherCountryNetIncome">Net Income from Assets in Another Country:</label>
            <input
              type="number"
              id="assetsAnotherCountryNetIncome"
              name="assetsAnotherCountryNetIncome"
              step="0.01"
              value={formData.assetsAnotherCountryNetIncome}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="form-section">
          <h2 className="section-title">Page 2: Student & Family Expenses ({formData.ncCurrencySymbol})</h2>
          <h3 className="subsection-title">Student's Resources</h3>
          <div className="form-group">
            <label htmlFor="pg2StudentAnnualIncome">Student's Annual Income:</label>
            <input
              type="number"
              id="pg2StudentAnnualIncome"
              name="pg2StudentAnnualIncome"
              min="0"
              step="0.01"
              value={formData.pg2StudentAnnualIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg2StudentCashSavings">Student's Cash Savings:</label>
            <input
              type="number"
              id="pg2StudentCashSavings"
              name="pg2StudentCashSavings"
              min="0"
              step="0.01"
              value={formData.pg2StudentCashSavings}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg2StudentOtherAssets">Student's Other Assets:</label>
            <input
              type="number"
              id="pg2StudentOtherAssets"
              name="pg2StudentOtherAssets"
              min="0"
              step="0.01"
              value={formData.pg2StudentOtherAssets}
              onChange={handleChange}
            />
          </div>

          <h3 className="subsection-title">Family Expenses</h3>
          <div className="form-group">
            <label htmlFor="pg2ParentsAnnualDiscretionaryExpenditure">Parents' Annual Discretionary Expenditure:</label>
            <input
              type="number"
              id="pg2ParentsAnnualDiscretionaryExpenditure"
              name="pg2ParentsAnnualDiscretionaryExpenditure"
              min="0"
              step="0.01"
              value={formData.pg2ParentsAnnualDiscretionaryExpenditure}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg2OtherHouseholdCosts">Other Household Costs (if parents live in different homes):</label>
            <input
              type="number"
              id="pg2OtherHouseholdCosts"
              name="pg2OtherHouseholdCosts"
              min="0"
              step="0.01"
              value={formData.pg2OtherHouseholdCosts}
              onChange={handleChange}
              disabled={formData.parentsLiveSameHome}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg2TotalOutstandingDebt">Total Outstanding Debt (Parent 2):</label>
            <input
              type="number"
              id="pg2TotalOutstandingDebt"
              name="pg2TotalOutstandingDebt"
              min="0"
              step="0.01"
              value={formData.pg2TotalOutstandingDebt}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg2AnnualDebtPayment">Annual Debt Payment (Parent 2):</label>
            <input
              type="number"
              id="pg2AnnualDebtPayment"
              name="pg2AnnualDebtPayment"
              min="0"
              step="0.01"
              value={formData.pg2AnnualDebtPayment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="annualLoanRepayment">Annual Loan Repayment:</label>
            <input
              type="number"
              id="annualLoanRepayment"
              name="annualLoanRepayment"
              min="0"
              step="0.01"
              value={formData.annualLoanRepayment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="familyAnticipatedAnnualSavings">Family Anticipated Annual Savings:</label>
            <input
              type="number"
              id="familyAnticipatedAnnualSavings"
              name="familyAnticipatedAnnualSavings"
              min="0"
              step="0.01"
              value={formData.familyAnticipatedAnnualSavings}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="potentialLoanAmount">Potential Loan Amount:</label>
            <input
              type="number"
              id="potentialLoanAmount"
              name="potentialLoanAmount"
              min="0"
              step="0.01"
              value={formData.potentialLoanAmount}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="form-section">
          <h2 className="section-title">Page 3: UWC Specifics (USD)</h2>
          <div className="form-group">
            <label htmlFor="annualTravelCostUSD">Annual Travel Cost (to/from UWC):</label>
            <input
              type="number"
              id="annualTravelCostUSD"
              name="annualTravelCostUSD"
              min="0"
              step="0.01"
              value={formData.annualTravelCostUSD}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ncScholarshipProvidedTwoYearsUSD">National Committee Scholarship Provided (2 Years):</label>
            <input
              type="number"
              id="ncScholarshipProvidedTwoYearsUSD"
              name="ncScholarshipProvidedTwoYearsUSD"
              min="0"
              step="0.01"
              value={formData.ncScholarshipProvidedTwoYearsUSD}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="button button-primary">
            Calculate Assessment
          </button>
          <button type="button" onClick={handleReset} className="button button-secondary">
            Reset Form
          </button>
        </div>
      </form>

      <section className="results-section">
        <h2 className="section-title">Assessment Results</h2>
        <div ref={pdfContentRef} className="pdf-content-wrapper">
          <h3 className="pdf-title">Financial Need Assessment Report</h3>

          <div className="summary-block">
            <h4 className="summary-title">General Application Details</h4>
            <p><strong>National Currency Symbol:</strong> {allSchoolResults.ncCurrencySymbol}</p>
            <p><strong>Exchange Rate (1 USD = X NC Currency):</strong> {allSchoolResults.exchangeRateToUSD}</p>
            <p><strong>Exchange Rate Date:</strong> {allSchoolResults.exchangeRateDate || 'N/A'}</p>
            <p><strong>Annual Return on Assets (%):</strong> {(formData.annualReturnOnAssets * 100).toFixed(2)}%</p>
          </div>

          <div className="summary-block">
            <h4 className="summary-title">Family Financial Summary (USD)</h4>
            <p><strong>Total Annual Income:</strong> ${allSchoolResults.totalAnnualIncome}</p>
            <p><strong>Total Cash Assets:</strong> ${allSchoolResults.totalCashAssets}</p>
            <p><strong>Annual Return on Family Assets:</strong> ${allSchoolResults.annualReturnOnFamilyAssets}</p>
            <p><strong>Home Equity:</strong> ${allSchoolResults.homeEquity}</p>
            <p><strong>UWC Family Contribution Required (Formula Max):</strong> ${allSchoolResults.uwcFamilyContributionRequiredUSD}</p>
            <p><strong>Family Anticipated Annual Savings:</strong> ${allSchoolResults.familyAnticipatedAnnualSavings}</p>
            <p><strong>Potential Loan Amount:</strong> ${allSchoolResults.potentialLoanAmount}</p>
          </div>

          <div className="school-results-container">
            <h4 className="school-results-title">School-Specific Assessment Breakdown</h4>
            {allSchoolResults.allSchoolResults.map((school, index) => (
              <div key={index} className={`school-result-card ${school.contributionClassName}`}>
                <h5 className="school-name">{school.schoolName}</h5>
                <p><strong>Annual Fees:</strong> ${school.schoolAnnualFeesUSD}</p>
                <p><strong>Avg. Additional Costs:</strong> ${school.schoolAvgAdditionalCostsUSD}</p>
                <p><strong>Annual Travel Cost:</strong> ${formData.annualTravelCostUSD.toFixed(2)}</p>
                <p><strong>Total Gross Annual Cost of Attendance:</strong> ${school.totalGrossAnnualCostOfAttendanceUSD}</p>
                <p><strong>Total Need:</strong> ${school.totalNeedUSD}</p>
                <p><strong>UWC Needs-Based Scholarship:</strong> ${school.uwcNeedsBasedScholarshipUSD} ({school.uwcNeedsBasedScholarshipPercentage}%)</p>
                <p><strong>Net UWC Annual Fees:</strong> ${school.netUWCAnnualFeesUSD}</p>
                <p><strong>Suggested Family Contribution (2 Yrs):</strong> ${school.suggestedFamilyContributionTwoYearsUSD}</p>
                <p><strong>National Committee Scholarship Provided (2 Yrs):</strong> ${formData.ncScholarshipProvidedTwoYearsUSD.toFixed(2)}</p>
                <p><strong>Combined NC & Family Contribution (2 Yrs):</strong> ${school.combinedNcAndFamilyContributionTwoYearsUSD}</p>
                <p><strong>Total Cost of Attendance (2 Yrs):</strong> ${school.totalCostOfAttendanceTwoYearsUSD}</p>
                <p className="affordability-status">
                  <strong>Affordability Status: </strong>
                  <span>{school.contributionStatus}</span>
                </p>
                <p><strong>Amount Payable By School Annually:</strong> ${school.amountPayableBySchoolAnnual}</p>
                <p><strong>Amount Payable By Family Annually:</strong> ${school.amountPayableByFamilyAnnual}</p>
                <p><strong>Percentage Payable By School:</strong> {school.percentagePayableBySchool}%</p>
                <p><strong>Percentage Payable By Family:</strong> {school.percentagePayableByFamily}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="download-button-container">
        <button type="button" onClick={handleDownloadPdf} className="button button-success">
          Download Assessment PDF
        </button>
      </div>
    </div>
  );
}

export default App;