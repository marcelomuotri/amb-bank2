import { Box, Typography } from "@mui/material";
import { useState } from "react";
import SimpleTable from "../../components/SimpleTable";
import { searchColumns, TableRowData } from "../../config/simpleTableColumns";
import { t } from "i18next";

const rowsData: TableRowData[] = [
  { id: 1, date: '2024-01-01', checkNumber: '', details: 'Western Funding Payables 122923 F_WFI1069038', credit: 2380.48, debit: 0, balance: 123137.99, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 2, date: '2024-01-02', checkNumber: '', details: 'Purchase authorized on 12/29 Wesco Insurance CO 012-345-6789 PA S583363650522916 Card 7995', credit: 0, debit: 3905.20, balance: 119232.79, account: 'Insurance Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 3, date: '2024-01-03', checkNumber: '', details: 'Purchase authorized on 12/29 Wesco Insurance CO 012-345-6789 PA S583363650537856 Card 7995', credit: 0, debit: 1380.00, balance: 117852.79, account: 'Insurance Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 4, date: '2024-01-04', checkNumber: '1178', details: 'Deposited OR Cashed Check', credit: 0, debit: 875.00, balance: 116977.79, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 5, date: '2024-01-05', checkNumber: '', details: '01/02Bankcard Deposit -0328121737', credit: 0, debit: 855.51, balance: 116122.28, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 6, date: '2024-01-06', checkNumber: '', details: 'Purchase authorized on 12/30 Fedex595938084 800-4633339 TN S383364482441490 Card 5347', credit: 0, debit: 66.36, balance: 116055.92, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 7, date: '2024-01-07', checkNumber: '', details: 'Online Transfer to Iron Cars Inc. Ref #Ib0Ls7Fhyp Business Checking 2019 Crv 403130 Curltailment', credit: 0, debit: 1139.29, balance: 114916.63, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 8, date: '2024-01-08', checkNumber: '1174', details: 'Check', credit: 0, debit: 2941.30, balance: 111975.33, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 9, date: '2024-01-09', checkNumber: '1180', details: 'Check', credit: 0, debit: 1720.00, balance: 110255.33, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 10, date: '2024-01-10', checkNumber: '1175', details: 'Check', credit: 0, debit: 575.00, balance: 109680.33, account: 'Repairs & Maintenance', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 11, date: '2024-01-11', checkNumber: '1179', details: 'Check', credit: 0, debit: 800.00, balance: 108880.33, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 12, date: '2024-01-12', checkNumber: '', details: 'Business to Business ACH Debit - Westlake Floorin Payables 122923 xxxxx2741 100462741 ,Rolling Cars LLC ,Vin:5Tdkz3DC8Hs82', credit: 0, debit: 1613.81, balance: 107266.52, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 13, date: '2024-01-13', checkNumber: '', details: 'Business to Business ACH Debit - Westlake Floorin Payables 122923 xxxxx2741 100462741 ,Rolling Cars LLC ,Vin:5Tfju4Gn7Bx00', credit: 0, debit: 2283.22, balance: 104983.30, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 14, date: '2024-01-14', checkNumber: '', details: 'Business to Business ACH Debit - Westlake Fin 323 Westlkcsr 231229 000001595000199 Rolling Cars LLC', credit: 0, debit: 17625.00, balance: 87358.30, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 15, date: '2024-01-15', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Ltfwn22 Business Checking 2012 Rav4 080578', credit: 10077.39, debit: 0, balance: 97435.69, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 16, date: '2024-01-16', checkNumber: '1176', details: 'Check', credit: 0, debit: 1000.00, balance: 96435.69, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 17, date: '2024-01-17', checkNumber: '1181', details: 'Check', credit: 0, debit: 10700.00, balance: 85735.69, account: 'Rent Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 18, date: '2024-01-18', checkNumber: '1182', details: 'Check', credit: 0, debit: 500.00, balance: 85235.69, account: 'Advertising & Promotion', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 19, date: '2024-01-19', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Business Checking xxxxxx7801 Ref #Ib0Ltq7Sms on 01/04/24', credit: 15000.00, debit: 0, balance: 100235.69, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 20, date: '2024-01-20', checkNumber: '', details: 'Recurring Payment authorized on 01/02 Cargurus 617-354-0068 MA S304003186562484 Card 5347', credit: 0, debit: 2000.00, balance: 98235.69, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 21, date: '2024-01-21', checkNumber: '', details: 'Westlake Financi Payables 010424 EFT01920552 F_100462741', credit: 979.55, debit: 0, balance: 99215.24, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 22, date: '2024-01-22', checkNumber: '', details: '01/05Bankcard Deposit -0328121737', credit: 14434.34, debit: 0, balance: 113649.58, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 23, date: '2024-01-23', checkNumber: '', details: 'Online Transfer to Iron Cars Inc. Ref #Ib0Ltrwzzh Business Checking 2016 Tucson 109134', credit: 0, debit: 1028.21, balance: 112621.37, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 24, date: '2024-01-24', checkNumber: '', details: 'Online Transfer to Iron Cars Inc. Ref #Ib0Ltrx6Zy Business Checking 2020 Corolla 001595', credit: 0, debit: 1040.00, balance: 111581.37, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 25, date: '2024-01-25', checkNumber: '', details: 'Online Transfer to Iron Cars Inc. Ref #Ib0Ltrxc7S Business Checking 2018 Rav4 447687', credit: 0, debit: 1166.65, balance: 110414.72, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 26, date: '2024-01-26', checkNumber: '', details: '01/08Bankcard Deposit -0328121737', credit: 3430.85, debit: 0, balance: 113845.57, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 27, date: '2024-01-27', checkNumber: '', details: 'Zelle From Rosesandrine Michel on 01/06 Ref # Bacm6Snxh8R7', credit: 500.00, debit: 0, balance: 114345.57, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 28, date: '2024-01-28', checkNumber: '', details: '01/08Bankcard Deposit -0328121737', credit: 2000.00, debit: 0, balance: 116345.57, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 29, date: '2024-01-29', checkNumber: '', details: 'Instant Pmt From Credit Acceptance Corp on 01/08 Ref#20240108011500120P1Busrt95020996613 6246.53Standard Rolling Cars LLC (Ahdr) A:11', credit: 6935.78, debit: 0, balance: 123281.35, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 30, date: '2024-01-30', checkNumber: '', details: 'Purchase authorized on 01/05 First Choice Auto West Park FL S464005668066218 Card 7995', credit: 0, debit: 75.98, balance: 123205.37, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 31, date: '2024-01-31', checkNumber: '', details: 'Purchase authorized on 01/06 Pita Pockets Hollywood FL S584006796287455 Card 7995', credit: 0, debit: 111.34, balance: 123094.03, account: 'Meals & Entertainment', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 32, date: '2024-02-01', checkNumber: '1187', details: 'Check', credit: 0, debit: 963.98, balance: 122130.05, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 33, date: '2024-02-02', checkNumber: '1185', details: 'Check', credit: 0, debit: 1900.00, balance: 120230.05, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 34, date: '2024-02-03', checkNumber: '1188', details: 'Check', credit: 0, debit: 300.00, balance: 119930.05, account: 'Insurance Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 35, date: '2024-02-04', checkNumber: '1184', details: 'Check', credit: 0, debit: 1150.00, balance: 118780.05, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 36, date: '2024-02-05', checkNumber: '1183', details: 'Check', credit: 0, debit: 840.00, balance: 117940.05, account: 'Repairs & Maintenance', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 37, date: '2024-02-06', checkNumber: '1189', details: 'Check', credit: 0, debit: 170.00, balance: 117770.05, account: 'Repairs & Maintenance', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 38, date: '2024-02-07', checkNumber: '', details: 'Business to Business ACH Debit - Westlake Floorin Payables 010824 xxxxx2741 100462741 ,Rolling Cars LLC ,Vin:Jtjyarbz2G202', credit: 0, debit: 1001.85, balance: 116768.20, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 39, date: '2024-02-08', checkNumber: '1186', details: 'Check', credit: 0, debit: 1503.75, balance: 115264.45, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 40, date: '2024-02-09', checkNumber: '', details: 'Western Funding Payables 010924 F_WFI1069038', credit: 10593.00, debit: 0, balance: 125857.45, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 41, date: '2024-02-10', checkNumber: '', details: 'Westlake Financi Payables 010924 EFT01926086 F_100462741', credit: 20925.04, debit: 0, balance: 146782.49, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 42, date: '2024-02-11', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Lwb7Xk8 Business Checking 2018 Lexus Nx 300 106580', credit: 19568.23, debit: 0, balance: 166350.72, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 43, date: '2024-02-12', checkNumber: '', details: 'Recurring Payment authorized on 01/08 Apple.Com/Bill 866-712-7753 CA S464009200899105 Card 5347', credit: 0, debit: 9.96, balance: 166340.76, account: 'Telephone Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 44, date: '2024-02-13', checkNumber: '', details: 'Purchase authorized on 01/09 Advance Auto Parts Hollywood FL S584009820314811 Card 7995', credit: 0, debit: 50.80, balance: 166289.96, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 45, date: '2024-02-14', checkNumber: '', details: 'Purchase authorized on 01/10 First Choice Auto Part West Park FL P000000570505502 Card 7995', credit: 0, debit: 133.00, balance: 166156.96, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 46, date: '2024-02-15', checkNumber: '', details: 'Purchase authorized on 01/10 The Home Depot #0285 Hollywood FL P584010672762776 Card 7995', credit: 0, debit: 35.10, balance: 166121.86, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 47, date: '2024-02-16', checkNumber: '', details: 'Purchase authorized on 01/10 First Choice Auto Part West Park FL P000000386453239 Card 7995', credit: 0, debit: 18.99, balance: 166102.87, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 48, date: '2024-02-17', checkNumber: '', details: 'Clover App Mrkt Clover App 240110 899-9862532-000 Rolling Cars', credit: 0, debit: 25.00, balance: 166077.87, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 49, date: '2024-02-18', checkNumber: '1190', details: 'Check', credit: 0, debit: 789.28, balance: 165288.59, account: 'Plates', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 50, date: '2024-02-19', checkNumber: '1192', details: 'Check', credit: 0, debit: 8390.00, balance: 156898.59, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 51, date: '2024-02-20', checkNumber: '', details: '01/11Bankcard Deposit -0328121737', credit: 146.35, debit: 0, balance: 157044.94, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 52, date: '2024-02-21', checkNumber: '', details: 'Bankcard Fee - 0328121737', credit: 0, debit: 25.86, balance: 157019.08, account: 'Bank Services Charges', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 53, date: '2024-02-22', checkNumber: '', details: 'Bankcard Discount Fee - 0328121737', credit: 0, debit: 56.98, balance: 156962.10, account: 'Bank Services Charges', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 54, date: '2024-02-23', checkNumber: '', details: 'Bankcard Interchange Fee - 0328121737', credit: 0, debit: 278.97, balance: 156683.13, account: 'Bank Services Charges', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 55, date: '2024-02-24', checkNumber: '', details: 'Purchase authorized on 01/11 The Home Depot #0285 Hollywood FL P304011769398971 Card 7995', credit: 0, debit: 40.59, balance: 156642.54, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 56, date: '2024-02-25', checkNumber: '', details: 'Business to Business ACH Debit - Westlake Floorin Payables 011024 xxxxx2741 100462741 ,Rolling Cars LLC ,Vin:Jtjyarbz9J210', credit: 0, debit: 18188.69, balance: 138453.85, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 57, date: '2024-02-26', checkNumber: '1191', details: 'Check', credit: 0, debit: 27930.00, balance: 110523.85, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 58, date: '2024-02-27', checkNumber: '', details: 'Westlake Financi Payables 011124 EFT01928291 F_100462741', credit: 469.69, debit: 0, balance: 110993.54, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 59, date: '2024-02-28', checkNumber: '', details: '01/12Bankcard Deposit -0328121737', credit: 475.00, debit: 0, balance: 111468.54, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 60, date: '2024-02-29', checkNumber: '', details: 'Recurring Payment authorized on 01/11 Offerup Offerup.Com WA S464011470077385 Card 7995', credit: 0, debit: 391.65, balance: 111076.89, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 61, date: '2024-03-01', checkNumber: '', details: 'Zelle to Ldi Auto Transport LLC on 01/12 Ref #Rp0Rvtj7Wp', credit: 0, debit: 270.00, balance: 110806.89, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 62, date: '2024-03-02', checkNumber: '', details: '01/16Bankcard Deposit -0328121737', credit: 375.00, debit: 0, balance: 111181.89, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 63, date: '2024-03-03', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Lx728Rb Business Checking 2019 Honda Crv 403130', credit: 4598.77, debit: 0, balance: 120729.01, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 64, date: '2024-03-04', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Lx72Zjw Business Checking 2013 Toyota Sienna 342962', credit: 11525.94, debit: 0, balance: 132254.95, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 65, date: '2024-03-05', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Lx72Zjw Business Checking 2013 Toyota Sienna 342962', credit: 11525.94, debit: 0, balance: 132254.95, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 66, date: '2024-03-06', checkNumber: '', details: 'Zelle From Carlos Hernandez Rojas on 01/14 Ref # Bacdjwxz93on', credit: 150.00, debit: 0, balance: 114628.24, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 67, date: '2024-03-07', checkNumber: '', details: '01/16Bankcard Deposit -0328121737', credit: 1502.00, debit: 0, balance: 116130.24, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 68, date: '2024-03-08', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Lx728Rb Business Checking 2019 Honda Crv 403130', credit: 4598.77, debit: 0, balance: 120729.01, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  { id: 69, date: '2024-03-09', checkNumber: '', details: 'Online Transfer From Road King Auto Sales LLC Ref #Ib0Lx72Zjw Business Checking 2013 Toyota Sienna 342962', credit: 11525.94, debit: 0, balance: 132254.95, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client3' },
  { id: 70, date: '2024-03-10', checkNumber: '', details: 'Purchase authorized on 01/11 Fedex596878540 800-4633339 TN S304011478894951 Card 5347', credit: 0, debit: 48.16, balance: 132206.79, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 71, date: '2024-03-11', checkNumber: '', details: 'Purchase authorized on 01/11 First Choice Auto West Park FL S384011675472173 Card 7995', credit: 0, debit: 20.00, balance: 132186.79, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 72, date: '2024-03-12', checkNumber: '', details: 'Purchase authorized on 01/12 Republic Services 866-576-5548 AZ S304012315657386 Card 5347', credit: 0, debit: 138.19, balance: 132048.60, account: 'Utilities', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 73, date: '2024-03-13', checkNumber: '', details: 'Purchase authorized on 01/12 Ross Stores #1043 Hallandle Bch FL S464012670045734 Card 7995', credit: 0, debit: 42.78, balance: 132005.82, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 74, date: '2024-03-14', checkNumber: '', details: 'Purchase authorized on 01/12 Amazon Prime*Rt4T6 Amzn.Com/Bill WA S304013087870486 Card 7995', credit: 0, debit: 15.11, balance: 131990.71, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 75, date: '2024-03-15', checkNumber: '', details: 'Purchase authorized on 01/13 Fedex597012916 800-4633339 TN S584013487245892 Card 5347', credit: 0, debit: 42.08, balance: 131948.63, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 76, date: '2024-03-16', checkNumber: '', details: 'Purchase authorized on 01/13 First Choice Auto West Park FL S384013675472173 Card 7995', credit: 0, debit: 20.00, balance: 131928.63, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 77, date: '2024-03-17', checkNumber: '', details: 'Purchase authorized on 01/13 The Home Depot #0285 Hollywood FL P304013769398971 Card 7995', credit: 0, debit: 40.59, balance: 131888.04, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 78, date: '2024-03-18', checkNumber: '', details: 'Purchase authorized on 01/13 Amazon Prime*Rt4T6 Amzn.Com/Bill WA S304013087870486 Card 7995', credit: 0, debit: 15.11, balance: 131872.93, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 79, date: '2024-03-19', checkNumber: '', details: 'Purchase authorized on 01/14 Fedex597012916 800-4633339 TN S584014487245892 Card 5347', credit: 0, debit: 42.08, balance: 131830.85, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 80, date: '2024-03-20', checkNumber: '', details: 'Purchase authorized on 01/14 First Choice Auto West Park FL S384014675472173 Card 7995', credit: 0, debit: 20.00, balance: 131810.85, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 81, date: '2024-03-21', checkNumber: '', details: 'Purchase authorized on 01/14 The Home Depot #0285 Hollywood FL P304014769398971 Card 7995', credit: 0, debit: 40.59, balance: 131770.26, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 82, date: '2024-03-22', checkNumber: '', details: 'Purchase authorized on 01/14 Amazon Prime*Rt4T6 Amzn.Com/Bill WA S304014087870486 Card 7995', credit: 0, debit: 15.11, balance: 131755.15, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 83, date: '2024-03-23', checkNumber: '', details: 'Purchase authorized on 01/15 Fedex597012916 800-4633339 TN S584015487245892 Card 5347', credit: 0, debit: 42.08, balance: 131713.07, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 84, date: '2024-03-24', checkNumber: '', details: 'Purchase authorized on 01/15 First Choice Auto West Park FL S384015675472173 Card 7995', credit: 0, debit: 20.00, balance: 131693.07, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 85, date: '2024-03-25', checkNumber: '', details: 'Purchase authorized on 01/15 The Home Depot #0285 Hollywood FL P304015769398971 Card 7995', credit: 0, debit: 40.59, balance: 131652.48, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 86, date: '2024-03-26', checkNumber: '', details: 'Purchase authorized on 01/15 Amazon Prime*Rt4T6 Amzn.Com/Bill WA S304015087870486 Card 7995', credit: 0, debit: 15.11, balance: 131637.37, account: 'Membership & Dues', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 87, date: '2024-03-27', checkNumber: '', details: 'Purchase authorized on 01/16 Fedex597012916 800-4633339 TN S584016487245892 Card 5347', credit: 0, debit: 42.08, balance: 131595.29, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
  { id: 88, date: '2024-03-28', checkNumber: '', details: 'Purchase authorized on 01/16 First Choice Auto West Park FL S384016675472173 Card 7995', credit: 0, debit: 20.00, balance: 131575.29, account: 'Parts Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 89, date: '2024-03-29', checkNumber: '', details: 'Purchase authorized on 01/16 The Home Depot #0285 Hollywood FL P304016769398971 Card 7995', credit: 0, debit: 40.59, balance: 131534.70, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 90, date: '2024-03-30', checkNumber: '1203', details: 'Check', credit: 0, debit: 157.00, balance: 123560.50, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 91, date: '2024-03-31', checkNumber: '1204', details: 'Check', credit: 0, debit: 2000.00, balance: 121560.50, account: 'Contractors', accountType: 'Expense', bank: 'Wells Fargo', client: 'client1' },
  { id: 92, date: '2024-04-01', checkNumber: '', details: 'Online Transfer to Iron Cars Inc. Ref #Ib0Lxypxkq Business Checking Nissan Rogue 613798', credit: 0, debit: 6571.30, balance: 114989.20, account: 'Vehicle Purchases', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client2' },
  { id: 93, date: '2024-04-02', checkNumber: '1201', details: 'Check', credit: 0, debit: 200.00, balance: 114789.20, account: 'Contractors', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 94, date: '2024-04-03', checkNumber: '1197', details: 'Check', credit: 0, debit: 1520.00, balance: 113269.20, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 95, date: '2024-04-04', checkNumber: '1200', details: 'Check', credit: 0, debit: 425.00, balance: 112844.20, account: 'Repairs & Maintenance', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 96, date: '2024-04-05', checkNumber: '', details: 'Comcast 8495752 550266176 240115 0330542 Rolling *Cars', credit: 0, debit: 325.43, balance: 112518.77, account: 'Computer & Internet', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 97, date: '2024-04-06', checkNumber: '', details: 'Check', credit: 0, debit: 2000.00, balance: 110518.77, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 98, date: '2024-04-07', checkNumber: '', details: 'Westlake Financi Payables 011624 EFT01934011 F_100462741', credit: 5464.26, debit: 0, balance: 115983.03, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client2' },
  // Datos de prueba adicionales para verificar filtrado numérico
  { id: 99, date: '2024-04-08', checkNumber: '1234', details: 'Test Check 1234', credit: 0, debit: 1234.56, balance: 123456.78, account: 'Test Account', accountType: 'Test', bank: 'Test Bank', client: 'client3' },
  { id: 100, date: '2024-04-09', checkNumber: '5678', details: 'Test Check 5678', credit: 5678.90, debit: 0, balance: 567890.12, account: 'Test Account', accountType: 'Test', bank: 'Test Bank', client: 'client1' },
  { id: 101, date: '2024-04-10', checkNumber: '9999', details: 'Test Check 9999', credit: 0, debit: 9999.99, balance: 999999.99, account: 'Test Account', accountType: 'Test', bank: 'Test Bank', client: 'client2' },
  { id: 102, date: '2024-04-11', checkNumber: '1111', details: 'Test Check 1111', credit: 1111.11, debit: 0, balance: 111111.11, account: 'Test Account', accountType: 'Test', bank: 'Test Bank', client: 'client3' },
  { id: 103, date: '2024-04-12', checkNumber: '2222', details: 'Test Check 2222', credit: 0, debit: 2222.22, balance: 222222.22, account: 'Test Account', accountType: 'Test', bank: 'Test Bank', client: 'client1' },
];

const Search = () => {
  const [rows, setRows] = useState(rowsData);

  const handleRowUpdate = (newRow: TableRowData, oldRow: TableRowData) => {
    setRows(prevRows => 
      prevRows.map(row => row.id === oldRow.id ? newRow : row)
    );
    console.log('Row updated:', { newRow, oldRow });
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "0px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <Typography
          component="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            fontSize: "1.5rem",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          {t('searchClients')}
        </Typography>
        
      </Box>
      
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "0px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <SimpleTable
          data={rows}
          columns={searchColumns}
          onRowUpdate={handleRowUpdate}
          editable={true}
          searchable={true}
          sortable={true}
          pagination={true}
          resizable={true}
        />
      </Box>
    </Box>
  );
};

export default Search;