const now = new Date()
const year = now.getFullYear()

export const demoCategories = [
  { id: 1, name: 'Food & Dining', icon: 'FD', color: '#f97316' },
  { id: 2, name: 'Transport', icon: 'TR', color: '#3b82f6' },
  { id: 3, name: 'Shopping', icon: 'SH', color: '#ec4899' },
  { id: 4, name: 'Bills & Utilities', icon: 'BU', color: '#8b5cf6' },
  { id: 5, name: 'Health', icon: 'HL', color: '#10b981' },
]

export const demoExpenses = [
  { id: 101, title: 'Coffee and breakfast', description: 'Cafe near the office', amount: 420, date: new Date(year, now.getMonth(), 27, 9).toISOString(), category: demoCategories[0] },
  { id: 102, title: 'Metro card recharge', description: 'Monthly commute', amount: 1500, date: new Date(year, now.getMonth(), 24, 11).toISOString(), category: demoCategories[1] },
  { id: 103, title: 'Household supplies', description: 'Weekly essentials', amount: 2840, date: new Date(year, now.getMonth(), 21, 17).toISOString(), category: demoCategories[2] },
  { id: 104, title: 'Electricity bill', description: 'October utility bill', amount: 2180, date: new Date(year, now.getMonth(), 18, 12).toISOString(), category: demoCategories[3] },
  { id: 105, title: 'Pharmacy', description: 'Monthly prescriptions', amount: 760, date: new Date(year, now.getMonth(), 15, 14).toISOString(), category: demoCategories[4] },
  { id: 106, title: 'Lunch with team', description: 'Project milestone', amount: 1260, date: new Date(year, now.getMonth(), 11, 13).toISOString(), category: demoCategories[0] },
  { id: 107, title: 'Ride share', description: 'Airport transfer', amount: 980, date: new Date(year, now.getMonth(), 6, 8).toISOString(), category: demoCategories[1] },
]

export const demoDashboard = {
  total_expenses: 98450,
  total_this_month: 8960,
  total_last_month: 10340,
  monthly_change_pct: -13.35,
  expense_count: 42,
  top_category: 'Food & Dining',
}

export const demoCategoryBreakdown = [
  { category_id: 1, category_name: 'Food & Dining', category_icon: 'FD', category_color: '#f97316', total: 3480, percentage: 39 },
  { category_id: 2, category_name: 'Transport', category_icon: 'TR', category_color: '#3b82f6', total: 2480, percentage: 28 },
  { category_id: 3, category_name: 'Shopping', category_icon: 'SH', category_color: '#ec4899', total: 1420, percentage: 16 },
  { category_id: 4, category_name: 'Bills & Utilities', category_icon: 'BU', category_color: '#8b5cf6', total: 1100, percentage: 12 },
  { category_id: 5, category_name: 'Health', category_icon: 'HL', category_color: '#10b981', total: 480, percentage: 5 },
]

export const demoMonthly = [
  { month: 1, total: 7400, count: 35 }, { month: 2, total: 8120, count: 37 },
  { month: 3, total: 7790, count: 34 }, { month: 4, total: 9210, count: 41 },
  { month: 5, total: 8650, count: 39 }, { month: 6, total: 10380, count: 46 },
  { month: 7, total: 9420, count: 42 }, { month: 8, total: 11020, count: 48 },
  { month: 9, total: 10340, count: 45 }, { month: 10, total: 8960, count: 42 },
  { month: 11, total: 0, count: 0 }, { month: 12, total: 0, count: 0 },
]
