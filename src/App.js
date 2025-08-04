import React, { useState, useMemo, useRef } from 'react';
import html2pdf from 'html2pdf.js';

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

// Embedded data from a comprehensive list of world currencies
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

// A standard, objective annual living allowance per person in USD.
// This replaces subjective discretionary expenditure inputs.
const standardLivingAllowancePerPersonUSD = 5000;

// --- Helper Functions moved outside the component for reusability ---
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

// --- Custom Hook for all financial calculations ---
const useFinancialCalculations = (formData) => {
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
    } = formData;

    if (getNum(exchangeRateToUSD) <= 0) {
      return {
        uwcFamilyContributionRequiredUSD: '0.00',
        allSchoolResults: schoolCostsData.map(school => ({
          schoolName: school.name,
          schoolAnnualFeesUSD: school.annualFeesUSD.toFixed(2),
          schoolAvgAdditionalCostsUSD: school.avgAdditionalCostsUSD.toFixed(2),
          totalGrossAnnualCostOfAttendanceUSD: '0.00',
          uwcNeedsBasedScholarshipUSD: '0.00',
          uwcNeedsBasedScholarshipPercentage: '0.00',
          contributionStatus: 'N/A',
          contributionColor: 'grey',
          amountPayableBySchoolAnnual: '0.00',
          amountPayableByFamilyAnnual: '0.00',
          percentagePayableBySchool: '0.00',
          percentagePayableByFamily: '0.00',
          totalCostOfAttendanceTwoYearsUSD: '0.00',
          combinedNcAndFamilyContributionTwoYearsUSD: '0.00'
        })),
      };
    }

    // --- Calculation Logic Start ---

    // Total number of people supported by the household income
    const totalHouseholdMembers = getNum(pg1NumberIndependentAdults) + getNum(pg1NumberFinancialDependents) + 1; // +1 for the student

    // Convert all National Currency (NC) values to USD
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

    // Calculate Total Annual Income
    const totalAnnualIncome =
      ncIncomePrimaryParentUSD +
      ncIncomeOtherParentUSD +
      ncAnnualBenefitsUSD +
      ncOtherAnnualIncomeUSD +
      ncOtherPropertiesNetIncomeUSD +
      ncAssetsAnotherCountryNetIncomeUSD;

    // Calculate contribution from assets
    // Calculate home equity
    const homeEquity = Math.max(0, convertNcToUsd(pg1HomeMarketValue, exchangeRateToUSD) - convertNcToUsd(pg1HomeOutstandingMortgage, exchangeRateToUSD));
    const totalFamilyAssetsUSD = ncCashSavingsUSD + ncOtherAssetsUSD + homeEquity;
    
    // Apply the annual return rate to all family assets, including home equity
    const totalAssetsContribution = totalFamilyAssetsUSD * getNum(annualReturnOnAssets);

    // Calculate total fixed expenses, now including school fees for other children and non-dependent children
    const totalAnnualFixedExpenditure = totalAnnualLivingExpensesUSD +
      convertNcToUsd(annualSchoolFeesForOtherChildren, exchangeRateToUSD) +
      convertNcToUsd(annualSchoolFeesForNonDependentChildren, exchangeRateToUSD);

    // Use a standard living allowance instead of subjective inputs
    const totalLivingAllowanceUSD = totalHouseholdMembers * standardLivingAllowancePerPersonUSD;

    // Formula 1: Family Contribution based on Income and Assets
    const formula1_familyContributionUSD = Math.max(
      0,
      totalAnnualIncome - totalAnnualFixedExpenditure + totalAssetsContribution
    );

    // Formula 2: Student's Contribution
    const formula2_studentContributionUSD =
      ncStudentAnnualIncomeUSD +
      (ncStudentCashSavingsUSD * 0.1) +
      (ncStudentOtherAssetsUSD * 0.05);

    // Formula 3: Cost to educate the student at home
    const formula3_estimateCostEducateStudentHome =
      (totalHouseholdMembers > 0 ? totalLivingAllowanceUSD / totalHouseholdMembers : 0);

    // Determine the UWC Family Contribution required, which is the maximum of the three formulas
    const uwcFamilyContributionRequiredUSD = Math.max(
      0,
      formula1_familyContributionUSD,
      formula2_studentContributionUSD,
      formula3_estimateCostEducateStudentHome
    );

    const finalUwcFamilyContribution = uwcFamilyContributionRequiredUSD;

    const calculatedSchoolResults = schoolCostsData.map(school => {
      const schoolAnnualFeesUSD = school.annualFeesUSD;
      const schoolAvgAdditionalCostsUSD = school.avgAdditionalCostsUSD;
      const totalGrossAnnualCostOfAttendanceUSD = getNum(schoolAnnualFeesUSD) + getNum(schoolAvgAdditionalCostsUSD) + getNum(annualTravelCostUSD);
      
      const totalNeedUSD = Math.max(0, totalGrossAnnualCostOfAttendanceUSD - finalUwcFamilyContribution);
      const uwcNeedsBasedScholarshipUSD = totalNeedUSD;

      const uwcNeedsBasedScholarshipPercentage =
        totalGrossAnnualCostOfAttendanceUSD > 0
          ? (uwcNeedsBasedScholarshipUSD / totalGrossAnnualCostOfAttendanceUSD) * 100
          : 0;

      const netUWCAnnualFeesUSD = Math.max(0, totalGrossAnnualCostOfAttendanceUSD - uwcNeedsBasedScholarshipUSD);

      const suggestedFamilyContributionTwoYearsUSD = Math.max(0, (finalUwcFamilyContribution * 2) - ncScholarshipProvidedTwoYearsUSD);
      const combinedNcAndFamilyContributionTwoYearsUSD = getNum(ncScholarshipProvidedTwoYearsUSD) + suggestedFamilyContributionTwoYearsUSD;
      const totalCostOfAttendanceTwoYearsUSD = totalGrossAnnualCostOfAttendanceUSD * 2;

      let contributionStatus = '';
      let contributionColor = '';
      const shortfall = totalCostOfAttendanceTwoYearsUSD - combinedNcAndFamilyContributionTwoYearsUSD;

      if (shortfall <= 0) {
        contributionStatus = 'Contribution Meets or Exceeds Cost';
        contributionColor = '#d4edda';
      } else if (shortfall <= 10000) {
        contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
        contributionColor = '#fff3cd';
      } else {
        contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
        contributionColor = '#f8d7da';
      }

      const amountPayableBySchoolAnnual = uwcNeedsBasedScholarshipUSD;
      const amountPayableByFamilyAnnual = finalUwcFamilyContribution;

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
        schoolAvgAdditionalCostsUSD: school.avgAdditionalCostsUSD.toFixed(2),
        totalGrossAnnualCostOfAttendanceUSD: totalGrossAnnualCostOfAttendanceUSD.toFixed(2),
        totalNeedUSD: totalNeedUSD.toFixed(2),
        uwcNeedsBasedScholarshipUSD: uwcNeedsBasedScholarshipUSD.toFixed(2),
        uwcNeedsBasedScholarshipPercentage: uwcNeedsBasedScholarshipPercentage.toFixed(2),
        netUWCAnnualFeesUSD: netUWCAnnualFeesUSD.toFixed(2),
        suggestedFamilyContributionTwoYearsUSD: suggestedFamilyContributionTwoYearsUSD.toFixed(2),
        combinedNcAndFamilyContributionTwoYearsUSD: combinedNcAndFamilyContributionTwoYearsUSD.toFixed(2),
        totalCostOfAttendanceTwoYearsUSD: totalCostOfAttendanceTwoYearsUSD.toFixed(2),
        contributionStatus,
        contributionColor,
        amountPayableBySchoolAnnual: amountPayableBySchoolAnnual.toFixed(2),
        amountPayableByFamilyAnnual: amountPayableByFamilyAnnual.toFixed(2),
        percentagePayableBySchool: percentagePayableBySchool.toFixed(2),
        percentagePayableByFamily: percentagePayableByFamily.toFixed(2),
      };
    });

    return {
      totalAnnualIncome: totalAnnualIncome.toFixed(2),
      totalFamilyAssetsUSD: totalFamilyAssetsUSD.toFixed(2),
      totalAssetsContribution: totalAssetsContribution.toFixed(2),
      homeEquity: homeEquity.toFixed(2),
      totalAnnualFixedExpenditure: totalAnnualFixedExpenditure.toFixed(2),
      uwcFamilyContributionRequiredUSD: finalUwcFamilyContribution.toFixed(2),
      familyAnticipatedAnnualSavings: getNum(formData.familyAnticipatedAnnualSavings).toFixed(2),
      potentialLoanAmount: getNum(formData.potentialLoanAmount).toFixed(2),
      allSchoolResults: calculatedSchoolResults,
    };
  }, [formData]);

  return allSchoolResults;
};

// --- Results Component to be rendered in Step 5 ---
const AssessmentResults = ({ formData, allSchoolResults, onDownloadPdf, onDownloadCsv, pdfContentRef }) => {
  return (
    <section style={{ marginTop: '30px', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
      <h2 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Assessment Results</h2>
      <div ref={pdfContentRef} style={{ padding: '10px', backgroundColor: '#fff', fontSize: '12px', lineHeight: '1.6' }}>
        <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', fontSize: '18px' }}>Financial Need Assessment Report</h3>
        <section style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h4 style={{ color: '#0056b3', marginBottom: '10px', fontSize: '14px' }}>General Application Details</h4>
          <p><strong>National Currency Symbol:</strong> {formData.ncCurrencySymbol || 'N/A'}</p>
          <p><strong>Exchange Rate (1 USD = X NC Currency):</strong> {formData.exchangeRateToUSD || 'N/A'}</p>
          <p><strong>Exchange Rate Date:</strong> {formData.exchangeRateDate || 'N/A'}</p>
          <p><strong>Annual Return on Assets (%):</strong> {(formData.annualReturnOnAssets * 100).toFixed(2)}%</p>
          <p><strong>Unusual Circumstances:</strong> {formData.unusualCircumstances || 'N/A'}</p>
        </section>
        <section style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h4 style={{ color: '#0056b3', marginBottom: '10px', fontSize: '14px' }}>Family Financial Summary (USD)</h4>
          <p><strong>Total Annual Income:</strong> ${allSchoolResults.totalAnnualIncome}</p>
          <p><strong>Total Family Assets:</strong> ${allSchoolResults.totalFamilyAssetsUSD}</p>
          <p><strong>Annual Contribution from Assets:</strong> ${allSchoolResults.totalAssetsContribution}</p>
          <p><strong>Home Equity:</strong> ${allSchoolResults.homeEquity}</p>
          <p><strong>UWC Family Contribution Required (Formula Max):</strong> ${allSchoolResults.uwcFamilyContributionRequiredUSD}</p>
          <p><strong>Family Anticipated Annual Savings:</strong> ${allSchoolResults.familyAnticipatedAnnualSavings}</p>
          <p><strong>Potential Loan Amount:</strong> ${allSchoolResults.potentialLoanAmount}</p>
        </section>
        <section>
          <h4 style={{ color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', fontSize: '16px' }}>School-Specific Assessment Breakdown</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>School</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Annual Fees</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Total Gross Annual Cost</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Needs-Based Scholarship</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>% by School</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Affordability Status</th>
                </tr>
              </thead>
              <tbody>
                {allSchoolResults.allSchoolResults.map((school, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{school.schoolName}</td>
                    <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'top' }}>${school.schoolAnnualFeesUSD}</td>
                    <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'top' }}>${school.totalGrossAnnualCostOfAttendanceUSD}</td>
                    <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'top' }}>${school.uwcNeedsBasedScholarshipUSD}</td>
                    <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'top' }}>{school.percentagePayableBySchool}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'top' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '15px',
                          backgroundColor: school.contributionColor,
                          color: '#333',
                          fontSize: '10px'
                        }}
                      >
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
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={onDownloadPdf} style={{ flex: 1, padding: '10px 20px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Download as PDF</button>
        <button onClick={onDownloadCsv} style={{ flex: 1, padding: '10px 20px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>Export to CSV</button>
      </div>
    </section>
  );
};

// Define the initial state outside the component for reusability
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
  const pdfContentRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
  };

  const allSchoolResults = useFinancialCalculations(formData);

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
      "Annual Fees (USD)",
      "Total Gross Annual Cost (USD)",
      "Needs-Based Scholarship (USD)",
      "% by School",
      "Affordability Status",
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(school =>
        [
          `"${school.schoolName}"`,
          school.schoolAnnualFeesUSD,
          school.totalGrossAnnualCostOfAttendanceUSD,
          school.uwcNeedsBasedScholarshipUSD,
          school.percentagePayableBySchool,
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

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f4f7f9' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #ccc', paddingBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2em' }}>UWC Financial Need Assessment Tool</h1>
      </header>

      <main style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 55%', minWidth: '400px' }}>
          <h2 style={{ color: '#34495e', marginBottom: '20px' }}>Input Form</h2>
          <form style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>General Information</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>National Currency Symbol:</label>
              <select
                name="ncCurrencySymbol"
                value={formData.ncCurrencySymbol}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {currencyList.map(currency => (
                  <option key={currency.abbr} value={currency.abbr}>{currency.abbr} ({currency.symbol})</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Exchange Rate (1 USD = X NC Currency):</label>
              <input
                type="number"
                name="exchangeRateToUSD"
                value={formData.exchangeRateToUSD}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Date of Exchange Rate:</label>
              <input
                type="date"
                name="exchangeRateDate"
                value={formData.exchangeRateDate}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual Return on Assets (%):</label>
              <input
                type="number"
                name="annualReturnOnAssets"
                value={(formData.annualReturnOnAssets * 100).toFixed(2)}
                onChange={e => handleInputChange({ target: { name: 'annualReturnOnAssets', value: e.target.value / 100 } })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual Travel Cost to UWC (USD):</label>
              <input
                type="number"
                name="annualTravelCostUSD"
                value={formData.annualTravelCostUSD}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <h3 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', marginTop: '30px' }}>Parent/Guardian 1 & 2 Financial Information</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Number of Independent Adults:</label>
              <input
                type="number"
                name="pg1NumberIndependentAdults"
                value={formData.pg1NumberIndependentAdults}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Number of Financial Dependents:</label>
              <input
                type="number"
                name="pg1NumberFinancialDependents"
                value={formData.pg1NumberFinancialDependents}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <h4 style={{ color: '#0056b3', marginTop: '20px', marginBottom: '10px' }}>Income Information (National Currency)</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual Income of Primary Parent:</label>
              <input
                type="number"
                name="pg1AnnualIncomePrimaryParent"
                value={formData.pg1AnnualIncomePrimaryParent}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual Income of Other Parent:</label>
              <input
                type="number"
                name="pg1AnnualIncomeOtherParent"
                value={formData.pg1AnnualIncomeOtherParent}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual Benefits:</label>
              <input
                type="number"
                name="pg1AnnualBenefits"
                value={formData.pg1AnnualBenefits}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Other Annual Income:</label>
              <input
                type="number"
                name="pg1OtherAnnualIncome"
                value={formData.pg1OtherAnnualIncome}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <h4 style={{ color: '#0056b3', marginTop: '20px', marginBottom: '10px' }}>Assets & Property (National Currency)</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Cash Savings:</label>
              <input
                type="number"
                name="pg1CashSavings"
                value={formData.pg1CashSavings}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Other Assets (e.g., investments, vehicles):</label>
              <input
                type="number"
                name="pg1OtherAssets"
                value={formData.pg1OtherAssets}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Home Market Value:</label>
              <input
                type="number"
                name="pg1HomeMarketValue"
                value={formData.pg1HomeMarketValue}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Home Outstanding Mortgage:</label>
              <input
                type="number"
                name="pg1HomeOutstandingMortgage"
                value={formData.pg1HomeOutstandingMortgage}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Net Annual Income from other properties:</label>
              <input
                type="number"
                name="otherPropertiesNetIncome"
                value={formData.otherPropertiesNetIncome}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Net Annual Income from assets in another country:</label>
              <input
                type="number"
                name="assetsAnotherCountryNetIncome"
                value={formData.assetsAnotherCountryNetIncome}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <h4 style={{ color: '#0056b3', marginTop: '20px', marginBottom: '10px' }}>Living Expenses & Other Costs</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Total Annual Living Expenses (National Currency):</label>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
                *Note: This figure should represent the total annual cost of all regular household expenditures. This includes major expenses like rent or mortgage payments, as well as essentials such as food, utilities (water, electricity, internet), transportation, clothing, and other regular, non-discretionary costs. Do not include school fees for children, as those are captured in a separate field.
              </p>
              <input
                type="number"
                name="totalAnnualLivingExpensesNC"
                value={formData.totalAnnualLivingExpensesNC}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual School Fees for Other Dependent Children:</label>
              <input
                type="number"
                name="annualSchoolFeesForOtherChildren"
                value={formData.annualSchoolFeesForOtherChildren}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Annual School Fees for Other Non-Dependent Children:</label>
              <input
                type="number"
                name="annualSchoolFeesForNonDependentChildren"
                value={formData.annualSchoolFeesForNonDependentChildren}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <h4 style={{ color: '#0056b3', marginTop: '20px', marginBottom: '10px' }}>Student's Financial Information</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Student Annual Income (National Currency):</label>
              <input
                type="number"
                name="pg2StudentAnnualIncome"
                value={formData.pg2StudentAnnualIncome}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Student Cash Savings (National Currency):</label>
              <input
                type="number"
                name="pg2StudentCashSavings"
                value={formData.pg2StudentCashSavings}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Student Other Assets (National Currency):</label>
              <input
                type="number"
                name="pg2StudentOtherAssets"
                value={formData.pg2StudentOtherAssets}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <h4 style={{ color: '#0056b3', marginTop: '20px', marginBottom: '10px' }}>Other Funding & Circumstances</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Scholarship Provided by NC (2 years, USD):</label>
              <input
                type="number"
                name="ncScholarshipProvidedTwoYearsUSD"
                value={formData.ncScholarshipProvidedTwoYearsUSD}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Family Anticipated Annual Savings (USD):</label>
              <input
                type="number"
                name="familyAnticipatedAnnualSavings"
                value={formData.familyAnticipatedAnnualSavings}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Potential Loan Amount (USD):</label>
              <input
                type="number"
                name="potentialLoanAmount"
                value={formData.potentialLoanAmount}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>Unusual Circumstances:</label>
              <textarea
                name="unusualCircumstances"
                value={formData.unusualCircumstances}
                onChange={handleInputChange}
                rows="4"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </form>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleResetForm}
              style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Reset Form
            </button>
          </div>
        </div>

        <div style={{ flex: '1 1 40%', minWidth: '400px' }}>
          <AssessmentResults
            formData={formData}
            allSchoolResults={allSchoolResults}
            onDownloadPdf={handleDownloadPdf}
            onDownloadCsv={handleDownloadCsv}
            pdfContentRef={pdfContentRef}
          />
        </div>
      </main>
    </div>
  );
};

export default App;