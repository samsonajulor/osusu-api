export interface Plan {
  id: number;
  title: string;
  numberOfBuddies?: User[];
  hasTarget: boolean;
  autoDebit: boolean;
  frequencyOfSavings: FrequencyOfSavings;
  startDate: string;
  targetSavingsAmount?: string;
  endDate: string;
  creator: User;
  duration: Duration;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
