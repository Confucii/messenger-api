export interface PopulatedChat {
  id: string;
  userOne: { displayName: string; id: string };
  userTwo: { displayName: string; id: string };
  updatedAt: Date;
}
