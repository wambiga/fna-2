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
    { abbr: 'GGP', symbol: '£' },
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
      annualTravelCostUSD,
      ncScholarshipProvidedTwoYearsUSD,
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
      let contributionColor = '';
      const shortfall = totalCostOfAttendanceTwoYearsUSD - combinedNcAndFamilyContributionTwoYearsUSD;

      if (shortfall <= 0) {
        contributionStatus = 'Contribution Meets or Exceeds Cost';
        contributionColor = '#d4edda'; // Green for success
      } else if (shortfall <= 10000) {
        contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
        contributionColor = '#fff3cd'; // Orange for warning
      } else {
        contributionStatus = `Shortfall of $${shortfall.toFixed(2)}`;
        contributionColor = '#f8d7da'; // Red for danger
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
        contributionColor,
        amountPayableBySchoolAnnual: amountPayableBySchoolAnnual.toFixed(2),
        amountPayableByFamilyAnnual: amountPayableByFamilyAnnual.toFixed(2),
        percentagePayableBySchool: percentagePayableBySchool.toFixed(2),
        percentagePayableByFamily: percentagePayableByFamily.toFixed(2),
      };
    });

    return {
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
      familyAnticipatedAnnualSavings: getNum(formData.familyAnticipatedAnnualSavings).toFixed(2),
      potentialLoanAmount: getNum(formData.potentialLoanAmount).toFixed(2),
      allSchoolResults: calculatedSchoolResults,
    };
  }, [formData]);

  return allSchoolResults;
};

// --- Results Component to be rendered in Step 5 ---
const AssessmentResults = ({ formData, allSchoolResults, onDownloadPdf, pdfContentRef }) => {
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
        </section>
        <section style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h4 style={{ color: '#0056b3', marginBottom: '10px', fontSize: '14px' }}>Family Financial Summary (USD)</h4>
          <p><strong>Total Annual Income:</strong> ${allSchoolResults.totalAnnualIncome}</p>
          <p><strong>Total Cash Assets:</strong> ${allSchoolResults.totalCashAssets}</p>
          <p><strong>Annual Return on Family Assets:</strong> ${allSchoolResults.annualReturnOnFamilyAssets}</p>
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
                          fontSize: '10px',
                          fontWeight: 'bold',
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onDownloadPdf}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}
        >
          Download Assessment PDF
        </button>
      </div>
    </section>
  );
};


// --- The main App Component ---
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ncCurrencySymbol: '',
    exchangeRateToUSD: 0,
    exchangeRateDate: '',
    annualReturnOnAssets: 0.025,
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

  const [errors, setErrors] = useState({});
  const pdfContentRef = useRef(null);

  const allSchoolResults = useFinancialCalculations(formData);

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

  const handleNextStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (getNum(formData.exchangeRateToUSD) <= 0) {
        newErrors.exchangeRateToUSD = 'Exchange Rate must be greater than 0.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setFormData({
      ncCurrencySymbol: '',
      exchangeRateToUSD: 0,
      exchangeRateDate: '',
      annualReturnOnAssets: 0.025,
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
    setCurrentStep(1);
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

  const renderStep = (step) => {
    switch (step) {
      case 1:
        return (
          <section style={{ marginBottom: '20px', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <h2 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Step 1: General Information</h2>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="ncCurrencySymbol" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>National Currency Symbol:</label>
              <select
                id="ncCurrencySymbol"
                name="ncCurrencySymbol"
                value={formData.ncCurrencySymbol}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select Currency</option>
                {currencyList.map(currency => (
                  <option key={currency.abbr} value={currency.abbr}>
                    {currency.abbr} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="exchangeRateToUSD" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Exchange Rate (1 USD = X NC Currency):
                {errors.exchangeRateToUSD && <span style={{ color: 'red', marginLeft: '10px', fontSize: '0.9em' }}>{errors.exchangeRateToUSD}</span>}
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
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="exchangeRateDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Exchange Rate Date:</label>
              <input
                type="date"
                id="exchangeRateDate"
                name="exchangeRateDate"
                value={formData.exchangeRateDate}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="annualReturnOnAssets" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Return on Assets (%):</label>
              <input
                type="number"
                id="annualReturnOnAssets"
                name="annualReturnOnAssets"
                min="0"
                step="0.01"
                value={formData.annualReturnOnAssets * 100}
                onChange={(e) => handleChange({ ...e, target: { ...e.target, value: parseFloat(e.target.value) / 100 } })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </section>
        );
      case 2:
        return (
          <section style={{ marginBottom: '20px', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <h2 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Step 2: Family Income & Assets ({formData.ncCurrencySymbol})</h2>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="parentsLiveSameHome" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontWeight: 'bold' }}>
                Parents live in the same home?
                <input
                  type="checkbox"
                  id="parentsLiveSameHome"
                  name="parentsLiveSameHome"
                  checked={formData.parentsLiveSameHome}
                  onChange={handleChange}
                  style={{ marginLeft: '10px' }}
                />
              </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1NumberIndependentAdults" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number of Independent Adults:</label>
              <select
                id="pg1NumberIndependentAdults"
                name="pg1NumberIndependentAdults"
                value={formData.pg1NumberIndependentAdults}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {generateNumberOptions(0, 5)}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1NumberFinancialDependents" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number of Financial Dependents (excluding student):</label>
              <select
                id="pg1NumberFinancialDependents"
                name="pg1NumberFinancialDependents"
                value={formData.pg1NumberFinancialDependents}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {generateNumberOptions(0, 10)}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1AnnualIncomePrimaryParent" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Income (Primary Parent):</label>
              <input
                type="number"
                id="pg1AnnualIncomePrimaryParent"
                name="pg1AnnualIncomePrimaryParent"
                min="0"
                step="0.01"
                value={formData.pg1AnnualIncomePrimaryParent}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1AnnualIncomeOtherParent" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Income (Other Parent):</label>
              <input
                type="number"
                id="pg1AnnualIncomeOtherParent"
                name="pg1AnnualIncomeOtherParent"
                min="0"
                step="0.01"
                value={formData.pg1AnnualIncomeOtherParent}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1AnnualBenefits" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Benefits:</label>
              <input
                type="number"
                id="pg1AnnualBenefits"
                name="pg1AnnualBenefits"
                min="0"
                step="0.01"
                value={formData.pg1AnnualBenefits}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1OtherAnnualIncome" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Other Annual Income:</label>
              <input
                type="number"
                id="pg1OtherAnnualIncome"
                name="pg1OtherAnnualIncome"
                min="0"
                step="0.01"
                value={formData.pg1OtherAnnualIncome}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1CashSavings" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cash Savings:</label>
              <input
                type="number"
                id="pg1CashSavings"
                name="pg1CashSavings"
                min="0"
                step="0.01"
                value={formData.pg1CashSavings}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1OtherAssets" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Other Assets (e.g., investments, non-retirement accounts):</label>
              <input
                type="number"
                id="pg1OtherAssets"
                name="pg1OtherAssets"
                min="0"
                step="0.01"
                value={formData.pg1OtherAssets}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1HomeMarketValue" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Home Market Value:</label>
              <input
                type="number"
                id="pg1HomeMarketValue"
                name="pg1HomeMarketValue"
                min="0"
                step="0.01"
                value={formData.pg1HomeMarketValue}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1HomeOutstandingMortgage" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Home Outstanding Mortgage:</label>
              <input
                type="number"
                id="pg1HomeOutstandingMortgage"
                name="pg1HomeOutstandingMortgage"
                min="0"
                step="0.01"
                value={formData.pg1HomeOutstandingMortgage}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1TotalOutstandingDebt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Outstanding Debt (Parent 1):</label>
              <input
                type="number"
                id="pg1TotalOutstandingDebt"
                name="pg1TotalOutstandingDebt"
                min="0"
                step="0.01"
                value={formData.pg1TotalOutstandingDebt}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg1AnnualDebtPayment" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Debt Payment (Parent 1):</label>
              <input
                type="number"
                id="pg1AnnualDebtPayment"
                name="pg1AnnualDebtPayment"
                min="0"
                step="0.01"
                value={formData.pg1AnnualDebtPayment}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="otherPropertiesNetIncome" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Net Income from Other Properties:</label>
              <input
                type="number"
                id="otherPropertiesNetIncome"
                name="otherPropertiesNetIncome"
                step="0.01"
                value={formData.otherPropertiesNetIncome}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="assetsAnotherCountryNetIncome" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Net Income from Assets in Another Country:</label>
              <input
                type="number"
                id="assetsAnotherCountryNetIncome"
                name="assetsAnotherCountryNetIncome"
                step="0.01"
                value={formData.assetsAnotherCountryNetIncome}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </section>
        );
      case 3:
        return (
          <section style={{ marginBottom: '20px', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <h2 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Step 3: Student & Family Expenses ({formData.ncCurrencySymbol})</h2>
            <h3 style={{ color: '#666', marginBottom: '15px' }}>Student's Resources</h3>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2StudentAnnualIncome" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student's Annual Income:</label>
              <input
                type="number"
                id="pg2StudentAnnualIncome"
                name="pg2StudentAnnualIncome"
                min="0"
                step="0.01"
                value={formData.pg2StudentAnnualIncome}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2StudentCashSavings" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student's Cash Savings:</label>
              <input
                type="number"
                id="pg2StudentCashSavings"
                name="pg2StudentCashSavings"
                min="0"
                step="0.01"
                value={formData.pg2StudentCashSavings}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2StudentOtherAssets" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student's Other Assets:</label>
              <input
                type="number"
                id="pg2StudentOtherAssets"
                name="pg2StudentOtherAssets"
                min="0"
                step="0.01"
                value={formData.pg2StudentOtherAssets}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <h3 style={{ color: '#666', marginBottom: '15px', marginTop: '30px' }}>Family Expenses</h3>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2ParentsAnnualDiscretionaryExpenditure" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Parents' Annual Discretionary Expenditure:</label>
              <input
                type="number"
                id="pg2ParentsAnnualDiscretionaryExpenditure"
                name="pg2ParentsAnnualDiscretionaryExpenditure"
                min="0"
                step="0.01"
                value={formData.pg2ParentsAnnualDiscretionaryExpenditure}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2OtherHouseholdCosts" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Other Household Costs (if parents live in different homes):</label>
              <input
                type="number"
                id="pg2OtherHouseholdCosts"
                name="pg2OtherHouseholdCosts"
                min="0"
                step="0.01"
                value={formData.pg2OtherHouseholdCosts}
                onChange={handleChange}
                disabled={formData.parentsLiveSameHome}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: formData.parentsLiveSameHome ? '#e9ecef' : 'white' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2TotalOutstandingDebt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Outstanding Debt (Parent 2):</label>
              <input
                type="number"
                id="pg2TotalOutstandingDebt"
                name="pg2TotalOutstandingDebt"
                min="0"
                step="0.01"
                value={formData.pg2TotalOutstandingDebt}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pg2AnnualDebtPayment" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Debt Payment (Parent 2):</label>
              <input
                type="number"
                id="pg2AnnualDebtPayment"
                name="pg2AnnualDebtPayment"
                min="0"
                step="0.01"
                value={formData.pg2AnnualDebtPayment}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="annualLoanRepayment" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Loan Repayment:</label>
              <input
                type="number"
                id="annualLoanRepayment"
                name="annualLoanRepayment"
                min="0"
                step="0.01"
                value={formData.annualLoanRepayment}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="familyAnticipatedAnnualSavings" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Family Anticipated Annual Savings:</label>
              <input
                type="number"
                id="familyAnticipatedAnnualSavings"
                name="familyAnticipatedAnnualSavings"
                min="0"
                step="0.01"
                value={formData.familyAnticipatedAnnualSavings}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="potentialLoanAmount" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Potential Loan Amount:</label>
              <input
                type="number"
                id="potentialLoanAmount"
                name="potentialLoanAmount"
                min="0"
                step="0.01"
                value={formData.potentialLoanAmount}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </section>
        );
      case 4:
        return (
          <section style={{ marginBottom: '20px', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <h2 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Step 4: UWC Specifics (USD)</h2>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="annualTravelCostUSD" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Travel Cost (to/from UWC):</label>
              <input
                type="number"
                id="annualTravelCostUSD"
                name="annualTravelCostUSD"
                min="0"
                step="0.01"
                value={formData.annualTravelCostUSD}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="ncScholarshipProvidedTwoYearsUSD" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>National Committee Scholarship Provided (2 Years):</label>
              <input
                type="number"
                id="ncScholarshipProvidedTwoYearsUSD"
                name="ncScholarshipProvidedTwoYearsUSD"
                min="0"
                step="0.01"
                value={formData.ncScholarshipProvidedTwoYearsUSD}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </section>
        );
      case 5:
        return (
          <AssessmentResults
            formData={formData}
            allSchoolResults={allSchoolResults}
            onDownloadPdf={handleDownloadPdf}
            pdfContentRef={pdfContentRef}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Financial Need Analysis Form</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} style={{ padding: '10px', borderRadius: '5px', backgroundColor: currentStep === step ? '#007bff' : '#f0f0f0', color: currentStep === step ? 'white' : 'black', cursor: 'pointer' }}>
            Step {step}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); }}>
        {renderStep(currentStep)}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginRight: '10px' }}
            >
              Back
            </button>
          )}

          {currentStep < 5 && (
            <button
              type="button"
              onClick={handleNextStep}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
            >
              Next
            </button>
          )}

          {currentStep === 5 && (
            <button
              type="button"
              onClick={handleReset}
              style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}
            >
              Reset Form
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;