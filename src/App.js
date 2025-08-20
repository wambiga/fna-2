import React, { useState, useMemo, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';

// Embedded data from "FNA Tool.xlsx - Totals school costs.csv"
// Updated to include local currency fees and other attributes
const schoolCostsData = [
  { name: 'UWC South East Asia', annualFeesUSD: 68249, annualFeesLocalCurrency: 91400, avgAdditionalCostsUSD: 7918.91, maxScholarshipPercentage: 0.8, localCurrency: 'SGD', localCurrencyExchangeRateToUSD: 1.34 },
  { name: 'Li Po Chun United World College of Hong Kong', annualFeesUSD: 49883, annualFeesLocalCurrency: 391617, avgAdditionalCostsUSD: 2613.76, maxScholarshipPercentage: 0.8, localCurrency: 'HKD', localCurrencyExchangeRateToUSD: 7.85 },
  { name: 'UWC Robert Bosch College', annualFeesUSD: 41395, annualFeesLocalCurrency: 38083, avgAdditionalCostsUSD: 4073.40, maxScholarshipPercentage: 0.8, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.92 },
  { name: 'UWC Costa Rica', annualFeesUSD: 43000, annualFeesLocalCurrency: 43000, avgAdditionalCostsUSD: 3140, maxScholarshipPercentage: 0.8, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
  { name: 'Waterford Kamhlaba UWC of Southern Africa', annualFeesUSD: 30925, annualFeesLocalCurrency: 556650, avgAdditionalCostsUSD: 2270.62, maxScholarshipPercentage: 0.8, localCurrency: 'SZL', localCurrencyExchangeRateToUSD: 18.0 },
  { name: 'UWC Dilijan', annualFeesUSD: 44000, annualFeesLocalCurrency: 44000, avgAdditionalCostsUSD: 800, maxScholarshipPercentage: 0.8, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
  { name: 'UWC Atlantic', annualFeesUSD: 42000, annualFeesLocalCurrency: 33180, avgAdditionalCostsUSD: 3800, maxScholarshipPercentage: 0.8, localCurrency: 'GBP', localCurrencyExchangeRateToUSD: 0.79 },
  { name: 'UWC Mahindra College', annualFeesUSD: 40000, annualFeesLocalCurrency: 3320000, avgAdditionalCostsUSD: 3000, maxScholarshipPercentage: 0.8, localCurrency: 'INR', localCurrencyExchangeRateToUSD: 83.0 },
  { name: 'UWC Pearson College', annualFeesUSD: 45000, annualFeesLocalCurrency: 61650, avgAdditionalCostsUSD: 4200, maxScholarshipPercentage: 0.8, localCurrency: 'CAD', localCurrencyExchangeRateToUSD: 1.37 },
  { name: 'UWC Changshu China', annualFeesUSD: 46000, annualFeesLocalCurrency: 333500, avgAdditionalCostsUSD: 3500, maxScholarshipPercentage: 0.8, localCurrency: 'CNY', localCurrencyExchangeRateToUSD: 7.25 },
  { name: 'UWC Red Cross Nordic', annualFeesUSD: 41000, annualFeesLocalCurrency: 438700, avgAdditionalCostsUSD: 3000, maxScholarshipPercentage: 0.8, localCurrency: 'NOK', localCurrencyExchangeRateToUSD: 10.7 },
  { name: 'UWC Adriatic', annualFeesUSD: 39000, annualFeesLocalCurrency: 35880, avgAdditionalCostsUSD: 3200, maxScholarshipPercentage: 0.8, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.92 },
  { name: 'UWC ISAK Japan', annualFeesUSD: 48000, annualFeesLocalCurrency: 7440000, avgAdditionalCostsUSD: 4000, maxScholarshipPercentage: 0.8, localCurrency: 'JPY', localCurrencyExchangeRateToUSD: 155.0 },
  { name: 'UWC Thailand', annualFeesUSD: 43000, annualFeesLocalCurrency: 1570000, avgAdditionalCostsUSD: 3500, maxScholarshipPercentage: 0.8, localCurrency: 'THB', localCurrencyExchangeRateToUSD: 36.5 },
  { name: 'UWC Mostar', annualFeesUSD: 38000, annualFeesLocalCurrency: 34960, avgAdditionalCostsUSD: 2800, maxScholarshipPercentage: 0.8, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.92 },
  { name: 'UWC Maastricht', annualFeesUSD: 40000, annualFeesLocalCurrency: 36800, avgAdditionalCostsUSD: 3000, maxScholarshipPercentage: 0.8, localCurrency: 'EUR', localCurrencyExchangeRateToUSD: 0.92 },
  { name: 'UWC East Africa', annualFeesUSD: 47000, annualFeesLocalCurrency: 117500000, avgAdditionalCostsUSD: 4000, maxScholarshipPercentage: 0.8, localCurrency: 'TZS', localCurrencyExchangeRateToUSD: 2500.0 },
  { name: 'UWC USA', annualFeesUSD: 60000, annualFeesLocalCurrency: 60000, avgAdditionalCostsUSD: 5000, maxScholarshipPercentage: 0.8, localCurrency: 'USD', localCurrencyExchangeRateToUSD: 1.0 },
];

const currencyList = [
  { abbr: 'AED', symbol: 'د.إ' },
  { abbr: 'AFN', symbol: '؋' },
  { abbr: 'ALL', symbol: 'Lek' },
  { abbr: 'AMD', symbol: '֏' },
  { abbr: 'ANG', symbol: 'ƒ' },
  { abbr: 'AOA', symbol: 'Kz' },
  { abbr: 'ARS', symbol: '$' },
  { abbr: 'AUD', symbol: '$' },
  { abbr: 'AWG', symbol: 'ƒ' },
  { abbr: 'AZN', symbol: '₼' },
  { abbr: 'BAM', symbol: 'KM' },
  { abbr: 'BBD', symbol: '$' },
  { abbr: 'BDT', symbol: '৳' },
  { abbr: 'BGN', symbol: 'лв' },
  { abbr: 'BHD', symbol: '.د.ب' },
  { abbr: 'BIF', symbol: 'FBu' },
  { abbr: 'BMD', symbol: '$' },
  { abbr: 'BND', symbol: '$' },
  { abbr: 'BOB', symbol: '$b' },
  { abbr: 'BRL', symbol: 'R$' },
  { abbr: 'BSD', symbol: '$' },
  { abbr: 'BTN', symbol: 'Nu.' },
  { abbr: 'BWP', symbol: 'P' },
  { abbr: 'BYN', symbol: 'Br' },
  { abbr: 'BZD', symbol: 'BZ$' },
  { abbr: 'CAD', symbol: '$' },
  { abbr: 'CDF', symbol: 'FC' },
  { abbr: 'CHF', symbol: 'CHF' },
  { abbr: 'CLP', symbol: '$' },
  { abbr: 'CNY', symbol: '¥' },
  { abbr: 'COP', symbol: '$' },
  { abbr: 'CRC', symbol: '₡' },
  { abbr: 'CUC', symbol: '$' },
  { abbr: 'CUP', symbol: '₱' },
  { abbr: 'CVE', symbol: '$' },
  { abbr: 'CZK', symbol: 'Kč' },
  { abbr: 'DJF', symbol: 'Fdj' },
  { abbr: 'DKK', symbol: 'kr' },
  { abbr: 'DOP', symbol: 'RD$' },
  { abbr: 'DZD', symbol: 'دج' },
  { abbr: 'EGP', symbol: '£' },
  { abbr: 'ERN', symbol: 'Nfk' },
  { abbr: 'ETB', symbol: 'Br' },
  { abbr: 'EUR', symbol: '€' },
  { abbr: 'FJD', symbol: '$' },
  { abbr: 'FKP', symbol: '£' },
  { abbr: 'GBP', symbol: '£' },
  { abbr: 'GEL', symbol: '₾' },
  { abbr: 'GHS', symbol: '¢' },
  { abbr: 'GIP', symbol: '£' },
  { abbr: 'GMD', symbol: 'D' },
  { abbr: 'GNF', symbol: 'FG' },
  { abbr: 'GTQ', symbol: 'Q' },
  { abbr: 'GYD', symbol: '$' },
  { abbr: 'HKD', symbol: '$' },
  { abbr: 'HNL', symbol: 'L' },
  { abbr: 'HRK', symbol: 'kn' },
  { abbr: 'HTG', symbol: 'G' },
  { abbr: 'HUF', symbol: 'Ft' },
  { abbr: 'IDR', symbol: 'Rp' },
  { abbr: 'ILS', symbol: '₪' },
  { abbr: 'IMP', symbol: '£' },
  { abbr: 'INR', symbol: '₹' },
  { abbr: 'IQD', symbol: 'ع.د' },
  { abbr: 'IRR', symbol: '﷼' },
  { abbr: 'ISK', symbol: 'kr' },
  { abbr: 'JEP', symbol: '£' },
  { abbr: 'JMD', symbol: 'J$' },
  { abbr: 'JOD', symbol: 'JD' },
  { abbr: 'JPY', symbol: '¥' },
  { abbr: 'KES', symbol: 'KSh' },
  { abbr: 'KGS', symbol: 'с' },
  { abbr: 'KHR', symbol: '៛' },
  { abbr: 'KMF', symbol: 'CF' },
  { abbr: 'KPW', symbol: '₩' },
  { abbr: 'KRW', symbol: '₩' },
  { abbr: 'KWD', symbol: 'KD' },
  { abbr: 'KYD', symbol: '$' },
  { abbr: 'KZT', symbol: '₸' },
  { abbr: 'LAK', symbol: '₭' },
  { abbr: 'LBP', symbol: '£' },
  { abbr: 'LKR', symbol: 'Rs' },
  { abbr: 'LRD', symbol: '$' },
  { abbr: 'LSL', symbol: 'L' },
  { abbr: 'LYD', symbol: 'ل.د' },
  { abbr: 'MAD', symbol: 'د.م.' },
  { abbr: 'MDL', symbol: 'L' },
  { abbr: 'MGA', symbol: 'Ar' },
  { abbr: 'MKD', symbol: 'ден' },
  { abbr: 'MMK', symbol: 'K' },
  { abbr: 'MNT', symbol: '₮' },
  { abbr: 'MOP', symbol: 'P' },
  { abbr: 'MUR', symbol: '₨' },
  { abbr: 'MVR', symbol: 'Rf' },
  { abbr: 'MWK', symbol: 'MK' },
  { abbr: 'MXN', symbol: '$' },
  { abbr: 'MYR', symbol: 'RM' },
  { abbr: 'MZN', symbol: 'MT' },
  { abbr: 'NAD', symbol: '$' },
  { abbr: 'NGN', symbol: '₦' },
  { abbr: 'NIO', symbol: 'C$' },
  { abbr: 'NOK', symbol: 'kr' },
  { abbr: 'NPR', symbol: '₨' },
  { abbr: 'NZD', symbol: '$' },
  { abbr: 'OMR', symbol: 'ر.ع.' },
  { abbr: 'PAB', symbol: 'B/.' },
  { abbr: 'PEN', symbol: 'S/.' },
  { abbr: 'PGK', symbol: 'K' },
  { abbr: 'PHP', symbol: '₱' },
  { abbr: 'PKR', symbol: '₨' },
  { abbr: 'PLN', symbol: 'zł' },
  { abbr: 'PYG', symbol: 'Gs' },
  { abbr: 'QAR', symbol: 'ر.ق' },
  { abbr: 'RON', symbol: 'lei' },
  { abbr: 'RSD', symbol: 'дин' },
  { abbr: 'RUB', symbol: '₽' },
  { abbr: 'RWF', symbol: 'RF' },
  { abbr: 'SAR', symbol: 'ر.س' },
  { abbr: 'SBD', symbol: '$' },
  { abbr: 'SCR', symbol: '₨' },
  { abbr: 'SDG', symbol: 'ج.س.' },
  { abbr: 'SEK', symbol: 'kr' },
  { abbr: 'SGD', symbol: 'S$' },
  { abbr: 'SHP', symbol: '£' },
  { abbr: 'SLL', symbol: 'Le' },
  { abbr: 'SOS', symbol: 'S' },
  { abbr: 'SRD', symbol: '$' },
  { abbr: 'SSP', symbol: '£' },
  { abbr: 'STD', symbol: 'Db' },
  { abbr: 'SYP', symbol: '£' },
  { abbr: 'SZL', symbol: 'L' },
  { abbr: 'THB', symbol: '฿' },
  { abbr: 'TJS', symbol: 'ЅМ' },
  { abbr: 'TMT', symbol: 'm' },
  { abbr: 'TND', symbol: 'د.ت' },
  { abbr: 'TOP', symbol: 'T$' },
  { abbr: 'TRY', symbol: '₺' },
  { abbr: 'TTD', symbol: 'TT$' },
  { abbr: 'TWD', symbol: 'NT$' },
  { abbr: 'TZS', symbol: 'TSh' },
  { abbr: 'UAH', symbol: '₴' },
  { abbr: 'UGX', symbol: 'USh' },
  { abbr: 'USD', symbol: '$' },
  { abbr: 'UYU', symbol: '$U' },
  { abbr: 'UZS', symbol: 'сўм' },
  { abbr: 'VEF', symbol: 'Bs' },
  { abbr: 'VND', symbol: '₫' },
  { abbr: 'VUV', symbol: 'Vt' },
  { abbr: 'WST', symbol: 'WS$' },
  { abbr: 'XAF', symbol: 'FCFA' },
  { abbr: 'XCD', symbol: '$' },
  { abbr: 'XOF', symbol: 'CFA' },
  { abbr: 'XPF', symbol: '₣' },
  { abbr: 'YER', symbol: '﷼' },
  { abbr: 'ZAR', symbol: 'R' },
  { abbr: 'ZMW', symbol: 'ZK' },
  { abbr: 'ZWL', symbol: 'Z$' }
];

const standardLivingAllowancePerPersonUSD = 5000;

const getNum = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const convertNcToUsd = (valueInNcCurrency, exchangeRate) => {
  if (exchangeRate <= 0) {
    return 0;
  }
  return getNum(valueInNcCurrency) / getNum(exchangeRate);
};

const useFinancialCalculations = (formData, maxScholarshipPercentages) => {
  const allSchoolResults = useMemo(() => {
    const {
      exchangeRateToUSD,
      annualReturnOnAssets,
      pg1NumberIndependentAdults,
      pg1NumberFinancialDependents,
      annualSchoolFeesForOtherChildren,
      annualSchoolFeesForNonDependentChildren,
      pg1AnnualIncomePrimaryParent,
      pg1AnnualIncomeOtherParent,
      pg1AnnualBenefits,
      pg1OtherAnnualIncome,
      pg1CashSavings,
      pg1OtherAssets,
      pg1HomeMarketValue,
      pg1HomeOutstandingMortgage,
      otherPropertiesNetIncome,
      assetsAnotherCountryNetIncome,
      pg2StudentAnnualIncome,
      pg2StudentCashSavings,
      pg2StudentOtherAssets,
      annualTravelCostUSD,
      ncScholarshipProvidedTwoYearsUSD,
      totalAnnualLivingExpensesNC,
      potentialLoanAmount,
    } = formData;

    if (getNum(exchangeRateToUSD) <= 0) {
      return {
        uwcFamilyContributionRequiredUSD: '0.00',
        allSchoolResults: schoolCostsData.map(school => ({
          schoolName: school.name,
          totalAllInclusiveCostTwoYearsUSD: '0.00',
          maxScholarshipAvailableUSD: '0.00',
          maxScholarshipPercentage: '0',
          needsBasedScholarshipGap: '0.00',
          contributionStatus: 'N/A',
          contributionColor: 'grey',
        })),
      };
    }

    const totalHouseholdMembers = getNum(pg1NumberIndependentAdults) + getNum(pg1NumberFinancialDependents) + 1;
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
    const totalAnnualLivingExpensesUSD = convertNcToUsd(totalAnnualLivingExpensesNC, exchangeRateToUSD);

    const totalAnnualIncome =
      ncIncomePrimaryParentUSD + ncIncomeOtherParentUSD + ncAnnualBenefitsUSD +
      ncOtherAnnualIncomeUSD + ncOtherPropertiesNetIncomeUSD + ncAssetsAnotherCountryNetIncomeUSD;
    const homeEquity = Math.max(0, convertNcToUsd(pg1HomeMarketValue, exchangeRateToUSD) - convertNcToUsd(pg1HomeOutstandingMortgage, exchangeRateToUSD));
    const totalFamilyAssetsUSD = ncCashSavingsUSD + ncOtherAssetsUSD + homeEquity;
    const totalAssetsContribution = totalFamilyAssetsUSD * getNum(annualReturnOnAssets);
    const totalAnnualFixedExpenditure = totalAnnualLivingExpensesUSD +
      convertNcToUsd(annualSchoolFeesForOtherChildren, exchangeRateToUSD) +
      convertNcToUsd(annualSchoolFeesForNonDependentChildren, exchangeRateToUSD);
    const totalLivingAllowanceUSD = totalHouseholdMembers * standardLivingAllowancePerPersonUSD;
    const formula1_familyContributionUSD = Math.max(0, totalAnnualIncome - totalAnnualFixedExpenditure + totalAssetsContribution);
    const formula2_studentContributionUSD = ncStudentAnnualIncomeUSD + (ncStudentCashSavingsUSD * 0.1) + (ncStudentOtherAssetsUSD * 0.05);
    const formula3_estimateCostEducateStudentHome = (totalHouseholdMembers > 0 ? totalLivingAllowanceUSD / totalHouseholdMembers : 0);
    const uwcFamilyContributionRequiredUSD = Math.max(0, formula1_familyContributionUSD, formula2_studentContributionUSD, formula3_estimateCostEducateStudentHome);

    const finalUwcFamilyContributionTwoYears = uwcFamilyContributionRequiredUSD * 2;

    const calculatedSchoolResults = schoolCostsData.map(school => {
      const schoolAnnualFeesUSD = school.annualFeesUSD;
      const schoolAvgAdditionalCostsUSD = school.avgAdditionalCostsUSD;
      
      const maxScholarshipPercentage = getNum(maxScholarshipPercentages[school.name]) / 100;
      const maxScholarshipLocal = (school.annualFeesLocalCurrency * 2) * maxScholarshipPercentage;
      const maxScholarshipFromSchoolUSD = maxScholarshipLocal / school.localCurrencyExchangeRateToUSD;
      
      const totalGrossAnnualCostOfAttendanceUSD = getNum(schoolAnnualFeesUSD) + getNum(schoolAvgAdditionalCostsUSD) + getNum(annualTravelCostUSD);
      const totalAllInclusiveCostTwoYearsUSD = totalGrossAnnualCostOfAttendanceUSD * 2;
      
      const totalScholarshipNeeded = totalAllInclusiveCostTwoYearsUSD - finalUwcFamilyContributionTwoYears - getNum(potentialLoanAmount);
      const finalScholarshipNeededFromSchool = Math.max(0, totalScholarshipNeeded - getNum(ncScholarshipProvidedTwoYearsUSD));
      
      let contributionStatus = '';
      let contributionColor = '';
      let shortfall = 0;

      if (finalScholarshipNeededFromSchool <= maxScholarshipFromSchoolUSD) {
          contributionStatus = 'Fully Funded';
          contributionColor = '#d4edda';
          shortfall = 0;
      } else {
          shortfall = finalScholarshipNeededFromSchool - maxScholarshipFromSchoolUSD;
          contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
          contributionColor = '#f8d7da';
      }

      return {
        schoolName: school.name,
        totalGrossAnnualCostOfAttendanceUSD: totalGrossAnnualCostOfAttendanceUSD.toFixed(2),
        totalAllInclusiveCostTwoYearsUSD: totalAllInclusiveCostTwoYearsUSD.toFixed(2),
        maxScholarshipAvailableUSD: maxScholarshipFromSchoolUSD.toFixed(2),
        maxScholarshipLocal: maxScholarshipLocal.toFixed(2),
        maxScholarshipPercentage: (maxScholarshipPercentage * 100).toFixed(0),
        localCurrencySymbol: school.localCurrency,
        finalScholarshipNeededFromSchool: finalScholarshipNeededFromSchool.toFixed(2),
        contributionStatus,
        contributionColor,
        shortfall: shortfall.toFixed(2),
      };
    });

    return {
      totalAnnualIncome: totalAnnualIncome.toFixed(2),
      totalFamilyAssetsUSD: totalFamilyAssetsUSD.toFixed(2),
      totalAssetsContribution: totalAssetsContribution.toFixed(2),
      homeEquity: homeEquity.toFixed(2),
      totalAnnualFixedExpenditure: totalAnnualFixedExpenditure.toFixed(2),
      uwcFamilyContributionRequiredUSD: uwcFamilyContributionRequiredUSD.toFixed(2),
      familyAnticipatedAnnualSavings: getNum(formData.familyAnticipatedAnnualSavings).toFixed(2),
      potentialLoanAmount: getNum(formData.potentialLoanAmount).toFixed(2),
      allSchoolResults: calculatedSchoolResults,
    };
  }, [formData, maxScholarshipPercentages]);

  return allSchoolResults;
};

// Component for the Assessment Results tab
const AssessmentResultsTab = ({ formData, allSchoolResults, onDownloadPdf, onDownloadCsv, pdfContentRef, maxScholarshipPercentages, handleMaxScholarshipChange }) => {
  return (
    <div className="tab-content">
      <section className="assessment-results">
        <div ref={pdfContentRef} className="pdf-content">
          <h3 className="report-title">Financial Need Assessment Report</h3>
          <section className="summary-section">
            <h4>General Application Details</h4>
            <p><strong>National Currency Symbol:</strong> {formData.ncCurrencySymbol || 'N/A'}</p>
            <p><strong>Exchange Rate (1 USD = X NC Currency):</strong> {formData.exchangeRateToUSD || 'N/A'}</p>
            <p><strong>Exchange Rate Date:</strong> {formData.exchangeRateDate || 'N/A'}</p>
            <p><strong>Annual Return on Assets (%):</strong> {(formData.annualReturnOnAssets * 100).toFixed(2)}%</p>
            <p><strong>Unusual Circumstances:</strong> {formData.unusualCircumstances || 'N/A'}</p>
          </section>
          <section className="summary-section">
            <h4>Family Financial Summary (USD)</h4>
            <p><strong>UWC Family Contribution Required (2 Years):</strong> ${allSchoolResults.uwcFamilyContributionRequiredUSD * 2}</p>
            <p><strong>Scholarship from NC (2 years):</strong> ${getNum(formData.ncScholarshipProvidedTwoYearsUSD).toFixed(2)}</p>
            <p><strong>Potential Loan Amount (2 years):</strong> ${allSchoolResults.potentialLoanAmount}</p>
          </section>
          <section className="schools-section">
            <h4>School-Specific Assessment Breakdown</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Total All-Inclusive Cost (2 years)</th>
                    <th>Max Scholarship Available</th>
                    <th>Final Scholarship Needed From School (2 years)</th>
                    <th>Affordability Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allSchoolResults.allSchoolResults.map((school, index) => (
                    <tr key={index}>
                      <td>{school.schoolName}</td>
                      <td>${school.totalAllInclusiveCostTwoYearsUSD}</td>
                      <td>
                        <div className="max-scholarship-input">
                          <input 
                            type="number"
                            value={school.maxScholarshipPercentage}
                            onChange={(e) => handleMaxScholarshipChange(school.schoolName, e.target.value)}
                            min="0"
                            max="100"
                          />
                          <span>% of fees</span>
                        </div>
                        <p className="scholarship-details">
                          (~ {school.localCurrencySymbol} {school.maxScholarshipLocal}) = ${school.maxScholarshipAvailableUSD} USD
                        </p>
                      </td>
                      <td>${school.finalScholarshipNeededFromSchool}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: school.contributionColor }}>
                          {school.contributionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <div className="download-buttons">
          <button onClick={onDownloadPdf}>Download as PDF</button>
          <button onClick={onDownloadCsv}>Export to CSV</button>
        </div>
      </section>
    </div>
  );
};

const initialFormData = {
  ncCurrencySymbol: 'USD',
  exchangeRateToUSD: 1.0,
  exchangeRateDate: new Date().toISOString().split('T')[0],
  annualReturnOnAssets: 0.05,
  pg1NumberIndependentAdults: 2,
  pg1NumberFinancialDependents: 0,
  annualSchoolFeesForOtherChildren: 0,
  annualSchoolFeesForNonDependentChildren: 0,
  pg1AnnualIncomePrimaryParent: 0,
  pg1AnnualIncomeOtherParent: 0,
  pg1AnnualBenefits: 0,
  pg1OtherAnnualIncome: 0,
  pg1CashSavings: 0,
  pg1OtherAssets: 0,
  pg1HomeMarketValue: 0,
  pg1HomeOutstandingMortgage: 0,
  otherPropertiesNetIncome: 0,
  assetsAnotherCountryNetIncome: 0,
  pg2StudentAnnualIncome: 0,
  pg2StudentCashSavings: 0,
  pg2StudentOtherAssets: 0,
  annualTravelCostUSD: 2000,
  ncScholarshipProvidedTwoYearsUSD: 0,
  totalAnnualLivingExpensesNC: 0,
  familyAnticipatedAnnualSavings: 0,
  potentialLoanAmount: 0,
  unusualCircumstances: '',
};

const App = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('general');
  const pdfContentRef = useRef(null);

  const [maxScholarshipPercentages, setMaxScholarshipPercentages] = useState({});

  useEffect(() => {
    const initialPercentages = {};
    schoolCostsData.forEach(school => {
      initialPercentages[school.name] = 0;
    });
    setMaxScholarshipPercentages(initialPercentages);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMaxScholarshipChange = (schoolName, value) => {
    setMaxScholarshipPercentages(prevPercentages => ({
      ...prevPercentages,
      [schoolName]: value,
    }));
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
    const initialPercentages = {};
    schoolCostsData.forEach(school => {
      initialPercentages[school.name] = 0;
    });
    setMaxScholarshipPercentages(initialPercentages);
    setActiveTab('general');
  };

  const allSchoolResults = useFinancialCalculations(formData, maxScholarshipPercentages);

  const handleDownloadPdf = () => {
    if (pdfContentRef.current) {
      const element = pdfContentRef.current;
      const opt = {
        margin: 1,
        filename: 'financial_need_assessment_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    }
  };

  const handleDownloadCsv = () => {
    const data = allSchoolResults.allSchoolResults;
    if (!data || data.length === 0) return;
    const headers = [
      "School",
      "Total All-Inclusive Cost (2 years) (USD)",
      "Max Scholarship Percentage (%)",
      "Max Scholarship Available (Local)",
      "Max Scholarship Available (USD)",
      "Final Scholarship Needed From School (USD)",
      "Affordability Status",
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(school =>
        [
          `"${school.schoolName}"`,
          school.totalAllInclusiveCostTwoYearsUSD,
          school.maxScholarshipPercentage,
          school.maxScholarshipLocal,
          school.maxScholarshipAvailableUSD,
          school.finalScholarshipNeededFromSchool,
          `"${school.contributionStatus}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'school_assessment_summary.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content">
            <div className="form-section">
              <h3>General Information</h3>
              <div className="input-group">
                <label>National Currency Symbol:</label>
                <select name="ncCurrencySymbol" value={formData.ncCurrencySymbol} onChange={handleInputChange}>
                  {currencyList.map(currency => (
                    <option key={currency.abbr} value={currency.abbr}>{currency.abbr} ({currency.symbol})</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Exchange Rate (1 USD = X NC Currency):</label>
                <input type="number" name="exchangeRateToUSD" value={formData.exchangeRateToUSD} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Date of Exchange Rate:</label>
                <input type="date" name="exchangeRateDate" value={formData.exchangeRateDate} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Annual Return on Assets (%):</label>
                <input
                  type="number"
                  name="annualReturnOnAssets"
                  value={(formData.annualReturnOnAssets * 100).toFixed(2)}
                  onChange={e => handleInputChange({ target: { name: 'annualReturnOnAssets', value: e.target.value / 100 } })}
                />
              </div>
              <div className="input-group">
                <label>Annual Travel Cost to UWC (USD):</label>
                <input type="number" name="annualTravelCostUSD" value={formData.annualTravelCostUSD} onChange={handleInputChange} />
              </div>
            </div>
            <div className="button-group">
              <button onClick={() => setActiveTab('parent')}>Next: Parent/Guardian Info</button>
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="tab-content">
            <div className="form-section">
              <h3>Parent/Guardian Financial Information</h3>
              <div className="input-group">
                <label>Number of Independent Adults:</label>
                <input type="number" name="pg1NumberIndependentAdults" value={formData.pg1NumberIndependentAdults} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Number of Financial Dependents:</label>
                <input type="number" name="pg1NumberFinancialDependents" value={formData.pg1NumberFinancialDependents} onChange={handleInputChange} />
              </div>
              <h4>Income (National Currency)</h4>
              <div className="input-group">
                <label>Annual Income of Primary Parent:</label>
                <input type="number" name="pg1AnnualIncomePrimaryParent" value={formData.pg1AnnualIncomePrimaryParent} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Annual Income of Other Parent:</label>
                <input type="number" name="pg1AnnualIncomeOtherParent" value={formData.pg1AnnualIncomeOtherParent} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Annual Benefits:</label>
                <input type="number" name="pg1AnnualBenefits" value={formData.pg1AnnualBenefits} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Other Annual Income:</label>
                <input type="number" name="pg1OtherAnnualIncome" value={formData.pg1OtherAnnualIncome} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Net Income from Other Properties:</label>
                <input type="number" name="otherPropertiesNetIncome" value={formData.otherPropertiesNetIncome} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Net Income from Assets in Another Country:</label>
                <input type="number" name="assetsAnotherCountryNetIncome" value={formData.assetsAnotherCountryNetIncome} onChange={handleInputChange} />
              </div>
              <h4>Assets (National Currency)</h4>
              <div className="input-group">
                <label>Cash and Savings:</label>
                <input type="number" name="pg1CashSavings" value={formData.pg1CashSavings} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Other Assets:</label>
                <input type="number" name="pg1OtherAssets" value={formData.pg1OtherAssets} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Home Market Value:</label>
                <input type="number" name="pg1HomeMarketValue" value={formData.pg1HomeMarketValue} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Home Outstanding Mortgage:</label>
                <input type="number" name="pg1HomeOutstandingMortgage" value={formData.pg1HomeOutstandingMortgage} onChange={handleInputChange} />
              </div>
              <h4>Annual Expenses (National Currency)</h4>
              <div className="input-group">
                <label>Total Annual Living Expenses:</label>
                <input type="number" name="totalAnnualLivingExpensesNC" value={formData.totalAnnualLivingExpensesNC} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Annual School Fees for Other Children:</label>
                <input type="number" name="annualSchoolFeesForOtherChildren" value={formData.annualSchoolFeesForOtherChildren} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Annual School Fees for Non-Dependent Children:</label>
                <input type="number" name="annualSchoolFeesForNonDependentChildren" value={formData.annualSchoolFeesForNonDependentChildren} onChange={handleInputChange} />
              </div>
            </div>
            <div className="button-group">
              <button onClick={() => setActiveTab('general')}>Back</button>
              <button onClick={() => setActiveTab('student')}>Next: Student Info</button>
            </div>
          </div>
        );
      case 'student':
        return (
          <div className="tab-content">
            <div className="form-section">
              <h3>Student Financial Information (National Currency)</h3>
              <div className="input-group">
                <label>Student Annual Income:</label>
                <input type="number" name="pg2StudentAnnualIncome" value={formData.pg2StudentAnnualIncome} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Student Cash & Savings:</label>
                <input type="number" name="pg2StudentCashSavings" value={formData.pg2StudentCashSavings} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Student Other Assets:</label>
                <input type="number" name="pg2StudentOtherAssets" value={formData.pg2StudentOtherAssets} onChange={handleInputChange} />
              </div>
            </div>
            <div className="button-group">
              <button onClick={() => setActiveTab('parent')}>Back</button>
              <button onClick={() => setActiveTab('additional')}>Next: Additional Info</button>
            </div>
          </div>
        );
      case 'additional':
        return (
          <div className="tab-content">
            <div className="form-section">
              <h3>Additional Contributions & Information</h3>
              <div className="input-group">
                <label>Scholarship from NC (2 years, USD):</label>
                <input type="number" name="ncScholarshipProvidedTwoYearsUSD" value={formData.ncScholarshipProvidedTwoYearsUSD} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Potential Loan Amount (USD):</label>
                <input type="number" name="potentialLoanAmount" value={formData.potentialLoanAmount} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Unusual Circumstances:</label>
                <textarea name="unusualCircumstances" value={formData.unusualCircumstances} onChange={handleInputChange} rows="3" />
              </div>
            </div>
            <div className="button-group">
              <button onClick={() => setActiveTab('student')}>Back</button>
              <button onClick={() => setActiveTab('results')}>View Results</button>
            </div>
          </div>
        );
      case 'results':
        return (
          <AssessmentResultsTab
            formData={formData}
            allSchoolResults={allSchoolResults}
            onDownloadPdf={handleDownloadPdf}
            onDownloadCsv={handleDownloadCsv}
            pdfContentRef={pdfContentRef}
            maxScholarshipPercentages={maxScholarshipPercentages}
            handleMaxScholarshipChange={handleMaxScholarshipChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>UWC Financial Need Assessment Tool</h1>
      </header>
      <main>
        <div className="tabs">
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>General</button>
          <button className={activeTab === 'parent' ? 'active' : ''} onClick={() => setActiveTab('parent')}>Parent/Guardian</button>
          <button className={activeTab === 'student' ? 'active' : ''} onClick={() => setActiveTab('student')}>Student</button>
          <button className={activeTab === 'additional' ? 'active' : ''} onClick={() => setActiveTab('additional')}>Additional</button>
          <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>Results</button>
        </div>
        <div className="tab-container">
          {renderTabContent()}
        </div>
      </main>
      <footer>
        <button onClick={handleResetForm}>Reset All Fields</button>
      </footer>
    </div>
  );
};

export default App;