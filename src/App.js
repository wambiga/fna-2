import React, { useState, useMemo, useCallback } from 'react';
import './App.css'; // Ensure this CSS file is linked

// A comprehensive list of world currencies (ISO 4217 codes and names)
// Sorted alphabetically for better user experience in the dropdown.
const worldCurrencies = [
    { code: 'AED', name: 'United Arab Emirates Dirham' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'AOA', name: 'Angolan Kwanza' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'AWG', name: 'Aruban Florin' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Convertible Mark' },
    { code: 'BBD', name: 'Barbadian Dollar' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'BIF', name: 'Burundian Franc' },
    { code: 'BMD', name: 'Bermudian Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'BSD', name: 'Bahamian Dollar' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', name: 'Botswana Pula' },
    { code: 'BYN', name: 'Belarusian Ruble' },
    { code: 'BZD', name: 'Belize Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CDF', name: 'Congolese Franc' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'CRC', name: 'Costa Rican Colón' },
    { code: 'CUC', name: 'Cuban Convertible Peso' },
    { code: 'CUP', name: 'Cuban Peso' },
    { code: 'CVE', name: 'Cape Verdean Escudo' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'DJF', name: 'Djiboutian Franc' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ERN', name: 'Eritrean Nakfa' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'EUR', name: 'Euro' },
    { code: 'FJD', name: 'Fijian Dollar' },
    { code: 'FKP', name: 'Falkland Islands Pound' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'GGP', name: 'Guernsey Pound' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'GIP', name: 'Gibraltar Pound' },
    { code: 'GMD', name: 'Gambian Dalasi' },
    { code: 'GNF', name: 'Guinean Franc' },
    { code: 'GTQ', name: 'Guatemalan Quetzal' },
    { code: 'GYD', name: 'Guyanese Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HNL', name: 'Honduran Lempira' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'HTG', name: 'Haitian Gourde' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'IMP', name: 'Isle of Man Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'IQD', name: 'Iraqi Dinar' },
    { code: 'IRR', name: 'Iranian Rial' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'JEP', name: 'Jersey Pound' },
    { code: 'JMD', name: 'Jamaican Dollar' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KGS', name: 'Kyrgyzstani Som' },
    { code: 'KHR', name: 'Cambodian Riel' },
    { code: 'KMF', name: 'Comorian Franc' },
    { code: 'KPW', name: 'North Korean Won' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'KYD', name: 'Cayman Islands Dollar' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LAK', name: 'Lao Kip' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'LRD', name: 'Liberian Dollar' },
    { code: 'LSL', name: 'Lesotho Loti' },
    { code: 'LTL', name: 'Lithuanian Litas' }, // Historical, replaced by EUR
    { code: 'LVL', name: 'Latvian Lats' }, // Historical, replaced by EUR
    { code: 'LYD', name: 'Libyan Dinar' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'MGA', name: 'Malagasy Ariary' },
    { code: 'MKD', name: 'Macedonian Denar' },
    { code: 'MMK', name: 'Myanmar Kyat' },
    { code: 'MNT', name: 'Mongolian Tögrög' },
    { code: 'MOP', name: 'Macanese Pataca' },
    { code: 'MRU', name: 'Mauritanian Ouguiya' }, // Updated from MRO
    { code: 'MUR', name: 'Mauritian Rupee' },
    { code: 'MVR', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', name: 'Malawian Kwacha' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'MZN', name: 'Mozambican Metical' },
    { code: 'NAD', name: 'Namibian Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'NIO', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'PAB', name: 'Panamanian Balboa' },
    { code: 'PEN', name: 'Peruvian Sol' },
    { code: 'PGK', name: 'Papua New Guinean Kina' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'PLN', name: 'Polish Złoty' },
    { code: 'PYG', name: 'Paraguayan Guaraní' },
    { code: 'QAR', name: 'Qatari Riyal' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RSD', name: 'Serbian Dinar' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SBD', name: 'Solomon Islands Dollar' },
    { code: 'SCR', name: 'Seychellois Rupee' },
    { code: 'SDG', name: 'Sudanese Pound' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SHP', name: 'Saint Helena Pound' },
    { code: 'SLL', name: 'Sierra Leonean Leone' }, // Note: SLL is old, now SLE. Using SLL for common usage.
    { code: 'SOS', name: 'Somali Shilling' },
    { code: 'SRD', name: 'Surinamese Dollar' },
    { code: 'SSP', name: 'South Sudanese Pound' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra' }, // Updated from STD
    { code: 'SVC', name: 'Salvadoran Colón' },
    { code: 'SYP', name: 'Syrian Pound' },
    { code: 'SZL', name: 'Swazi Lilangeni' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TJS', name: 'Tajikistani Somoni' },
    { code: 'TMT', name: 'Turkmenistan Manat' },
    { code: 'TND', name: 'Tunisian Dinar' },
    { code: 'TOP', name: 'Tongan Paʻanga' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'UZS', name: 'Uzbekistani Soʻm' },
    { code: 'VND', name: 'Vietnamese Đồng' },
    { code: 'VUV', name: 'Vanuatu Vatu' },
    { code: 'WST', name: 'Samoan Tala' },
    { code: 'XAF', name: 'CFA Franc BEAC' },
    { code: 'XCD', name: 'East Caribbean Dollar' },
    { code: 'XOF', name: 'CFA Franc BCEAO' },
    { code: 'XPF', name: 'CFP Franc' },
    { code: 'YER', name: 'Yemeni Rial' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
    { code: 'ZWL', name: 'Zimbabwean Dollar' }
];


// Embedded data from "FNA Tool.xlsx - Totals school costs.csv"
const schoolCostsData = [
  { name: 'UWC South East Asia', annualFeesUSD: 68249, avgAdditionalCostsUSD: 7918.91 },
  { name: 'Li Po Chun United World College of Hong Kong', annualFeesUSD: 49883, avgAdditionalCostsUSD: 2613.76 },
  { name: 'UWC Robert Bosch College', annualFeesUSD: 41395, avgAdditionalCostsUSD: 4073.40 },
  { name: 'UWC Costa Rica', annualFeesUSD: 43000, avgAdditionalCostsUSD: 3140 },
  { name: 'UWC ISAK Japan', annualFeesUSD: 48000, avgAdditionalCostsUSD: 4000 },
  { name: 'UWC Thailand', annualFeesUSD: 43000, avgAdditionalCostsUSD: 3500 },
  { name: 'UWC Mostar', annualFeesUSD: 38000, avgAdditionalCostsUSD: 2800 },
  { name: 'UWC Maastricht', annualFeesUSD: 40000, avgAdditionalCostsUSD: 3000 },
  { name: 'UWC East Africa', annualFeesUSD: 47000, avgAdditionalCostsUSD: 4000 },
  { name: 'UWC USA', annualFeesUSD: 60000, avgAdditionalCostsUSD: 5000 },
  { name: 'UWC Atlantic', annualFeesUSD: 42000, avgAdditionalCostsUSD: 3800 },
  { name: 'UWC Changshu China', annualFeesUSD: 46000, avgAdditionalCostsUSD: 3500 },
  { name: 'UWC Dilijan', annualFeesUSD: 44000, avgAdditionalCostsUSD: 800 },
  { name: 'UWC Mahindra College', annualFeesUSD: 40000, avgAdditionalCostsUSD: 3000 },
  { name: 'UWC Pearson College', annualFeesUSD: 45000, avgAdditionalCostsUSD: 4200 },
  { name: 'UWC Red Cross Nordic', annualFeesUSD: 41000, avgAdditionalCostsUSD: 3000 },
  { name: 'UWC Adriatic', annualFeesUSD: 39000, avgAdditionalCostsUSD: 3200 },
  { name: 'Waterford Kamhlaba UWC of Southern Africa', annualFeesUSD: 30925, avgAdditionalCostsUSD: 2270.62 },
];

// Define a threshold for "orange" affordability status (e.g., $10,000 annual gap)
const ANNUAL_AFFORDABILITY_GAP_THRESHOLD = 10000;

function App() {
  const [formData, setFormData] = useState({
    ncCurrencySymbol: '', // Empty - will be selected from dropdown
    exchangeRateToUSD: 0, // Zero
    exchangeRateDate: '', // Empty
    annualReturnOnAssets: 0, // Zero

    // Page 1: Family Income & Assets (all in NC unless specified)
    parentsLiveSameHome: true, // Default to true, can be changed by user
    pg1NumberIndependentAdults: 0, // Zero
    pg1NumberFinancialDependents: 0, // Zero
    pg1AnnualIncomePrimaryParent: 0, // Zero
    pg1AnnualIncomeOtherParent: 0, // Zero
    pg1AnnualBenefits: 0, // Zero
    pg1OtherAnnualIncome: 0, // Zero
    pg1CashSavings: 0, // Zero
    pg1OtherAssets: 0, // Zero
    pg1HomeMarketValue: 0, // Zero
    pg1HomeOutstandingMortgage: 0, // Zero
    pg1AnnualDebtPayment: 0, // Zero
    otherPropertiesNetIncome: 0, // Zero
    assetsAnotherCountryNetIncome: 0, // Zero

    // Page 2: Student & Family Expenses (all in NC unless specified)
    pg2StudentAnnualIncome: 0, // Zero
    pg2StudentCashSavings: 0, // Zero
    pg2StudentOtherAssets: 0, // Zero
    pg2ParentsAnnualDiscretionaryExpenditure: 0, // Zero
    pg2OtherHouseholdCosts: 0, // Zero
    pg2AnnualDebtPayment: 0, // Zero
    annualLoanRepayment: 0, // Zero
    familyAnticipatedAnnualSavings: 0, // Zero
    potentialLoanAmount: 0, // Zero

    // Page 3: UWC Specifics
    annualTravelCostUSD: 0, // Zero
    ncScholarshipProvidedTwoYearsUSD: 0, // Zero
    ncCurrentFeesPayableAnnual: 0, // Zero
  });

  // Helper function to convert to number, handling empty strings as 0
  const getNum = useCallback((value) => {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  }, []);

  // Helper function to convert National Currency to USD
  const convertNcToUsd = useCallback((amount, rate) => {
    return rate > 0 ? getNum(amount) / getNum(rate) : 0;
  }, [getNum]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData({
      ncCurrencySymbol: '',
      exchangeRateToUSD: 0,
      exchangeRateDate: '',
      annualReturnOnAssets: 0,

      parentsLiveSameHome: true,
      pg1NumberIndependentAdults: 0,
      pg1NumberFinancialDependents: 0,
      pg1AnnualIncomePrimaryParent: 0,
      pg1AnnualIncomeOtherParent: 0,
      pg1AnnualBenefits: 0,
      pg1OtherAnnualIncome: 0,
      pg1CashSavings: 0,
      pg1OtherAssets: 0,
      pg1HomeMarketValue: 0,
      pg1HomeOutstandingMortgage: 0,
      pg1AnnualDebtPayment: 0,
      otherPropertiesNetIncome: 0,
      assetsAnotherCountryNetIncome: 0,

      pg2StudentAnnualIncome: 0,
      pg2StudentCashSavings: 0,
      pg2StudentOtherAssets: 0,
      pg2ParentsAnnualDiscretionaryExpenditure: 0,
      pg2OtherHouseholdCosts: 0,
      pg2AnnualDebtPayment: 0,
      annualLoanRepayment: 0,
      familyAnticipatedAnnualSavings: 0,
      potentialLoanAmount: 0,

      annualTravelCostUSD: 0,
      ncScholarshipProvidedTwoYearsUSD: 0,
      ncCurrentFeesPayableAnnual: 0,
    });
  }, []);

  const allSchoolResults = useMemo(() => {
    const {
      exchangeRateToUSD,
      annualReturnOnAssets,
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
      pg2AnnualDebtPayment: pg2AnnualDebtPayment_NC,
      annualLoanRepayment,
      familyAnticipatedAnnualSavings,
      potentialLoanAmount,
      annualTravelCostUSD,
      ncScholarshipProvidedTwoYearsUSD,
      ncCurrentFeesPayableAnnual,
    } = formData;

    const numIndependentAdults = getNum(formData.pg1NumberIndependentAdults);


    if (getNum(exchangeRateToUSD) <= 0) {
      return {
        allSchoolResults: [],
        annualFundsAvailableForFeesUSD: 0,
        ncCurrentFeesPayableAnnualUSD: 0
      };
    }

    // --- Convert all NC inputs to USD ---
    const pg1AnnualIncomePrimaryParentUSD = convertNcToUsd(pg1AnnualIncomePrimaryParent, exchangeRateToUSD);
    const pg1AnnualIncomeOtherParentUSD = convertNcToUsd(pg1AnnualIncomeOtherParent, exchangeRateToUSD);
    const pg1AnnualBenefitsUSD = convertNcToUsd(pg1AnnualBenefits, exchangeRateToUSD);
    const pg1OtherAnnualIncomeUSD = convertNcToUsd(pg1OtherAnnualIncome, exchangeRateToUSD);
    const pg1CashSavingsUSD = convertNcToUsd(pg1CashSavings, exchangeRateToUSD);
    const pg1OtherAssetsUSD = convertNcToUsd(pg1OtherAssets, exchangeRateToUSD);
    const pg1HomeMarketValueUSD = convertNcToUsd(pg1HomeMarketValue, exchangeRateToUSD);
    const pg1HomeOutstandingMortgageUSD = convertNcToUsd(pg1HomeOutstandingMortgage, exchangeRateToUSD);
    const pg1AnnualDebtPaymentUSD = convertNcToUsd(pg1AnnualDebtPayment, exchangeRateToUSD);
    const otherPropertiesNetIncomeUSD = convertNcToUsd(otherPropertiesNetIncome, exchangeRateToUSD);
    const assetsAnotherCountryNetIncomeUSD = convertNcToUsd(assetsAnotherCountryNetIncome, exchangeRateToUSD);
    const pg2StudentAnnualIncomeUSD = convertNcToUsd(pg2StudentAnnualIncome, exchangeRateToUSD);
    const pg2StudentCashSavingsUSD = convertNcToUsd(pg2StudentCashSavings, exchangeRateToUSD);
    const pg2StudentOtherAssetsUSD = convertNcToUsd(pg2StudentOtherAssets, exchangeRateToUSD);
    const pg2ParentsAnnualDiscretionaryExpenditureUSD = convertNcToUsd(pg2ParentsAnnualDiscretionaryExpenditure, exchangeRateToUSD);
    const pg2OtherHouseholdCostsUSD = convertNcToUsd(pg2OtherHouseholdCosts, exchangeRateToUSD);
    const pg2AnnualDebtPaymentUSD = convertNcToUsd(pg2AnnualDebtPayment_NC, exchangeRateToUSD);
    const annualLoanRepaymentUSD = convertNcToUsd(annualLoanRepayment, exchangeRateToUSD);
    const ncFamilyAnticipatedAnnualSavingsUSD = convertNcToUsd(familyAnticipatedAnnualSavings, exchangeRateToUSD);
    const ncPotentialLoanAmountUSD = convertNcToUsd(potentialLoanAmount, exchangeRateToUSD);
    const ncCurrentFeesPayableAnnualUSD = convertNcToUsd(ncCurrentFeesPayableAnnual, exchangeRateToUSD);

    // --- Comprehensive Financial Need Assessment (FNA) Calculations ---

    // Total Family Income
    const totalAnnualIncome = getNum(pg1AnnualIncomePrimaryParentUSD) + getNum(pg1AnnualIncomeOtherParentUSD) + getNum(pg1AnnualBenefitsUSD) + getNum(pg1OtherAnnualIncomeUSD) + getNum(otherPropertiesNetIncomeUSD) + getNum(assetsAnotherCountryNetIncomeUSD);

    // Total Family Assets
    const totalCashAssets = getNum(pg1CashSavingsUSD);
    const totalOtherLiquidAssets = getNum(pg1OtherAssetsUSD);
    const totalHomeEquity = Math.max(0, getNum(pg1HomeMarketValueUSD) - getNum(pg1HomeOutstandingMortgageUSD));

    // Annual contribution from assets (Formula 1 component)
    const annualReturnOnFamilyAssets = totalCashAssets * getNum(annualReturnOnAssets);
    const annualReturnOnOtherLiquidAssets = totalOtherLiquidAssets * getNum(annualReturnOnAssets);
    const homeEquityContribution = totalHomeEquity * 0.01;

    // Total Annual Fixed Expenditure (debts, other household costs, discretionary for formula 3)
    const totalAnnualFixedExpenditure = getNum(pg1AnnualDebtPaymentUSD) + getNum(pg2AnnualDebtPaymentUSD) + getNum(annualLoanRepaymentUSD) + getNum(pg2OtherHouseholdCostsUSD);

    // Discretionary expenditure specifically used in Formula 3 (Cost to educate student at home)
    const discretionaryExpenditureForFormula3 = getNum(pg2ParentsAnnualDiscretionaryExpenditureUSD);

    // Student's Contribution
    const studentTotalAssets = getNum(pg2StudentCashSavingsUSD) + getNum(pg2StudentOtherAssetsUSD);
    const annualReturnOnStudentAssets = studentTotalAssets * getNum(annualReturnOnAssets);
    const studentAnnualContributionFromIncome = getNum(pg2StudentAnnualIncomeUSD) * 0.25;

    // --- FORMULA CALCULATIONS ---

    // Formula 1: Family Contribution from Income & Assets
    const formula1_familyContributionUSD = Math.max(0, totalAnnualIncome - totalAnnualFixedExpenditure - discretionaryExpenditureForFormula3 + annualReturnOnFamilyAssets + annualReturnOnOtherLiquidAssets + homeEquityContribution);

    // Formula 2: Student Contribution
    const formula2_studentContributionUSD = studentAnnualContributionFromIncome + annualReturnOnStudentAssets;

    // Formula 3: Estimated Cost to Educate Student at Home
    const formula3_estimateCostEducateStudentHome = Math.max(0, discretionaryExpenditureForFormula3 / (getNum(pg1NumberFinancialDependents) + numIndependentAdults)) * 1;

    // UWC Family Contribution Required (the highest of the relevant formulas)
    const uwcFamilyContributionRequiredUSD = Math.max(0, formula1_familyContributionUSD, formula2_studentContributionUSD, formula3_estimateCostEducateStudentHome);

    // --- Apply "Current Fees Payable" as a Minimum Floor ---
    const suggestedFamilyContributionTwoYearsUSD = (uwcFamilyContributionRequiredUSD * 2) - ncScholarshipProvidedTwoYearsUSD;

    const minimumCurrentFeesContributionTwoYearsUSD = ncCurrentFeesPayableAnnualUSD * 2;

    const finalFamilyContributionTwoYearsUSD = Math.max(suggestedFamilyContributionTwoYearsUSD, minimumCurrentFeesContributionTwoYearsUSD);

    const actualAnnualFamilyContributionUSD = finalFamilyContributionTwoYearsUSD / 2;


    // --- Annual Funds Available for Fees (for affordability check) ---
    const annualDisposableIncome = Math.max(0, totalAnnualIncome - totalAnnualFixedExpenditure - discretionaryExpenditureForFormula3);
    const annualFundsAvailableForFeesUSD = annualDisposableIncome + ncFamilyAnticipatedAnnualSavingsUSD + (ncPotentialLoanAmountUSD / 2);


    const calculatedSchoolResults = schoolCostsData.map(school => {
      const schoolAnnualFeesUSD = school.annualFeesUSD;
      const schoolAvgAdditionalCostsUSD = school.avgAdditionalCostsUSD;

      const totalGrossAnnualCostOfAttendanceUSD = getNum(schoolAnnualFeesUSD) + getNum(schoolAvgAdditionalCostsUSD) + getNum(annualTravelCostUSD);

      const uwcNeedsBasedScholarshipUSD = Math.max(0, totalGrossAnnualCostOfAttendanceUSD - actualAnnualFamilyContributionUSD);

      const finalFamilyPaymentRequiredAnnualUSD = actualAnnualFamilyContributionUSD;

      const percentagePayableBySchool =
        totalGrossAnnualCostOfAttendanceUSD > 0
          ? (uwcNeedsBasedScholarshipUSD / totalGrossAnnualCostOfAttendanceUSD) * 100
          : 0;

      const percentagePayableByFamily =
        totalGrossAnnualCostOfAttendanceUSD > 0
          ? (finalFamilyPaymentRequiredAnnualUSD / totalGrossAnnualCostOfAttendanceUSD) * 100
          : 0;

      // --- Affordability Status Calculation ---
      let affordabilityStatus = 'red';
      const annualGap = finalFamilyPaymentRequiredAnnualUSD - annualFundsAvailableForFeesUSD;

      if (annualFundsAvailableForFeesUSD >= finalFamilyPaymentRequiredAnnualUSD) {
          affordabilityStatus = 'green';
      } else if (annualGap <= ANNUAL_AFFORDABILITY_GAP_THRESHOLD) {
          affordabilityStatus = 'orange';
      } else {
          affordabilityStatus = 'red';
      }

      return {
        schoolName: school.name,
        schoolAnnualFeesUSD: schoolAnnualFeesUSD.toFixed(2),
        schoolAvgAdditionalCostsUSD: schoolAvgAdditionalCostsUSD.toFixed(2),
        totalGrossAnnualCostOfAttendanceUSD: totalGrossAnnualCostOfAttendanceUSD.toFixed(2),

        // Values from the Needs Assessment
        uwcFamilyContributionRequiredUSD: uwcFamilyContributionRequiredUSD.toFixed(2),
        actualAnnualFamilyContributionUSD: actualAnnualFamilyContributionUSD.toFixed(2),

        // Scholarship calculations (now uncapped)
        uwcNeedsBasedScholarshipUSD: uwcNeedsBasedScholarshipUSD.toFixed(2),
        netUWCAnnualFeesUSD: finalFamilyPaymentRequiredAnnualUSD.toFixed(2),

        // Final amounts family pays/school covers
        finalFamilyPaymentRequiredAnnualUSD: finalFamilyPaymentRequiredAnnualUSD.toFixed(2),
        amountPayableBySchoolAnnual: uwcNeedsBasedScholarshipUSD.toFixed(2),
        amountPayableByFamilyAnnual: finalFamilyPaymentRequiredAnnualUSD.toFixed(2),

        // Percentages
        uwcNeedsBasedScholarshipPercentage: percentagePayableBySchool.toFixed(2),
        percentagePayableBySchool: percentagePayableBySchool.toFixed(2),
        percentagePayableByFamily: percentagePayableByFamily.toFixed(2),

        // Two-year figures for overall understanding
        suggestedFamilyContributionTwoYearsUSD: suggestedFamilyContributionTwoYearsUSD.toFixed(2),
        minimumCurrentFeesContributionTwoYearsUSD: minimumCurrentFeesContributionTwoYearsUSD.toFixed(2),
        finalFamilyContributionTwoYearsUSD: finalFamilyContributionTwoYearsUSD.toFixed(2),
        combinedNcAndFamilyContributionTwoYearsUSD: (getNum(ncScholarshipProvidedTwoYearsUSD) + getNum(finalFamilyPaymentRequiredAnnualUSD) * 2).toFixed(2),
        totalCostOfAttendanceTwoYearsUSD: (totalGrossAnnualCostOfAttendanceUSD * 2).toFixed(2),
        combinedContributionMeetsExpectation: (getNum(ncScholarshipProvidedTwoYearsUSD) + getNum(finalFamilyPaymentRequiredAnnualUSD) * 2) >= (totalGrossAnnualCostOfAttendanceUSD * 2),

        // Affordability
        affordabilityStatus: affordabilityStatus,
      };
    });

    // Sort results by netUWCAnnualFeesUSD for ranking
    const sortedSchoolResults = [...calculatedSchoolResults].sort((a, b) => {
      return getNum(a.netUWCAnnualFeesUSD) - getNum(b.netUWCAnnualFeesUSD);
    });

    return {
      annualFundsAvailableForFeesUSD: annualFundsAvailableForFeesUSD.toFixed(2),
      ncCurrentFeesPayableAnnualUSD: ncCurrentFeesPayableAnnualUSD.toFixed(2),
      allSchoolResults: sortedSchoolResults,
    };
  }, [formData, convertNcToUsd, getNum]);

  return (
    <div className="App">
      <h1>UWC Financial Needs Assessment Tool</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <section className="form-section">
          <h2>General Financial Data</h2>
          <div className="form-group">
            <label htmlFor="ncCurrencySymbol">National Currency Symbol:</label>
            <select
              id="ncCurrencySymbol"
              name="ncCurrencySymbol"
              value={formData.ncCurrencySymbol}
              onChange={handleChange}
            >
              <option value="">-- Select Currency --</option>
              {worldCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exchangeRateToUSD">Exchange Rate to USD:</label>
            <input
              type="number"
              id="exchangeRateToUSD"
              name="exchangeRateToUSD"
              min="0.000001" // Allow very small rates, but not zero
              step="0.000001"
              value={formData.exchangeRateToUSD}
              onChange={handleChange}
              placeholder="e.g., 130 for KES to USD"
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
            <label htmlFor="annualReturnOnAssets">Annual Return on Liquid Assets (e.g., 0.025 for 2.5%):</label>
            <input
              type="number"
              id="annualReturnOnAssets"
              name="annualReturnOnAssets"
              min="0"
              step="0.001"
              value={formData.annualReturnOnAssets}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="form-section">
          <h2>Page 1: Family Income & Assets ({formData.ncCurrencySymbol || 'NC'})</h2>
          <div className="form-group">
            <label htmlFor="parentsLiveSameHome">Parents Live in Same Home:</label>
            <input
              type="checkbox"
              id="parentsLiveSameHome"
              name="parentsLiveSameHome"
              checked={formData.parentsLiveSameHome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1NumberIndependentAdults">Number of Independent Adults (excluding student):</label>
            <input
              type="number"
              id="pg1NumberIndependentAdults"
              name="pg1NumberIndependentAdults"
              min="0"
              value={formData.pg1NumberIndependentAdults}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1NumberFinancialDependents">Number of Financial Dependents (excluding student):</label>
            <input
              type="number"
              id="pg1NumberFinancialDependents"
              name="pg1NumberFinancialDependents"
              min="0"
              value={formData.pg1NumberFinancialDependents}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1AnnualIncomePrimaryParent">Annual Income - Primary Parent:</label>
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
            <label htmlFor="pg1AnnualIncomeOtherParent">Annual Income - Other Parent:</label>
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
            <label htmlFor="pg1AnnualBenefits">Annual Benefits (e.g., social security):</label>
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
            <label htmlFor="otherPropertiesNetIncome">Other Properties Net Income:</label>
            <input
              type="number"
              id="otherPropertiesNetIncome"
              name="otherPropertiesNetIncome"
              min="0"
              step="0.01"
              value={formData.otherPropertiesNetIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="assetsAnotherCountryNetIncome">Assets in Another Country Net Income:</label>
            <input
              type="number"
              id="assetsAnotherCountryNetIncome"
              name="assetsAnotherCountryNetIncome"
              min="0"
              step="0.01"
              value={formData.assetsAnotherCountryNetIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg1CashSavings">Cash & Savings:</label>
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
            <label htmlFor="pg1OtherAssets">Other Liquid Assets (e.g., stocks, bonds):</label>
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
            <label htmlFor="pg1AnnualDebtPayment">Annual Debt Payment (excluding mortgage):</label>
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
        </section>

        <section className="form-section">
          <h2>Page 2: Student & Family Expenses ({formData.ncCurrencySymbol || 'NC'})</h2>
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
            <label htmlFor="pg2StudentCashSavings">Student's Cash & Savings:</label>
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
            <label htmlFor="pg2StudentOtherAssets">Student's Other Liquid Assets:</label>
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
            <label htmlFor="pg2OtherHouseholdCosts">Other Annual Household Costs (e.g., utilities):</label>
            <input
              type="number"
              id="pg2OtherHouseholdCosts"
              name="pg2OtherHouseholdCosts"
              min="0"
              step="0.01"
              value={formData.pg2OtherHouseholdCosts}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pg2AnnualDebtPayment">Additional Annual Debt Payments (not in Page 1):</label>
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
            <label htmlFor="annualLoanRepayment">Annual Loan Repayment (for current loans):</label>
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
            <label htmlFor="potentialLoanAmount">Potential Loan Amount (Family willing to take):</label>
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
          <h2>Page 3: UWC Specifics</h2>
          <div className="form-group">
            <label htmlFor="annualTravelCostUSD">Annual Travel Cost (USD):</label>
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
            <label htmlFor="ncScholarshipProvidedTwoYearsUSD">National Committee Scholarship Provided (2 Years, USD):</label>
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
          <div className="form-group">
            <label htmlFor="ncCurrentFeesPayableAnnual">Current Annual Fees Payable (in {formData.ncCurrencySymbol || 'NC'}):</label>
            <input
              type="number"
              id="ncCurrentFeesPayableAnnual"
              name="ncCurrentFeesPayableAnnual"
              min="0"
              step="0.01"
              value={formData.ncCurrentFeesPayableAnnual}
              onChange={handleChange}
            />
          </div>
        </section>

        <button type="button" onClick={handleReset} className="reset-button">
          Reset Form
        </button>
      </form>

      <section className="results-section">
        <h2>Overall Financial Summary (USD)</h2>
        {/* Added check for exchangeRateToUSD to avoid division by zero early on */}
        {getNum(formData.exchangeRateToUSD) > 0 ? (
          <>
            <p><strong>Annual Funds Available for Fees:</strong> ${allSchoolResults.annualFundsAvailableForFeesUSD}</p>
            <p><strong>Current Annual Fees Payable (Converted):</strong> ${allSchoolResults.ncCurrentFeesPayableAnnualUSD}</p>
          </>
        ) : (
          <p className="warning-message">Please enter an exchange rate (e.g., 1 for USD) to see financial summaries.</p>
        )}


        <h2>School-Specific Assessment Results (USD)</h2>
        {getNum(formData.exchangeRateToUSD) > 0 && formData.ncCurrencySymbol ? ( // Also check if currency is selected
            <table>
            <thead>
                <tr>
                <th>School Name</th>
                <th>Total Annual Cost</th>
                <th>Assessed Family Contribution</th>
                <th>Actual Family Contribution (After Current Fees Min)</th>
                <th>UWC Needs-Based Scholarship</th>
                <th>Actual Family Payment Required</th>
                <th>School % Covered</th>
                <th>Family % Covered</th>
                <th>Affordability Status</th>
                </tr>
            </thead>
            <tbody>
                {allSchoolResults.allSchoolResults.map((result) => (
                <tr key={result.schoolName}>
                    <td>{result.schoolName}</td>
                    <td>${result.totalGrossAnnualCostOfAttendanceUSD}</td>
                    <td>${result.uwcFamilyContributionRequiredUSD}</td>
                    <td>${result.actualAnnualFamilyContributionUSD}</td>
                    <td>${result.uwcNeedsBasedScholarshipUSD}</td>
                    <td>${result.finalFamilyPaymentRequiredAnnualUSD}</td>
                    <td>{result.percentagePayableBySchool}%</td>
                    <td>{result.percentagePayableByFamily}%</td>
                    <td className={`status-${result.affordabilityStatus}`}>{result.affordabilityStatus.toUpperCase()}</td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <p className="warning-message">Enter an exchange rate and select a National Currency to calculate school results.</p>
        )}
      </section>
    </div>
  );
}

export default App;