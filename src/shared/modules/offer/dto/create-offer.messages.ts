export const CreateOfferValidationMessage = {
  title: {
    invalidFormat: 'title is required',
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    invalidFormat: 'description is required',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalidFormat: 'city must be Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf',
  },
  image: {
    isUrl: 'image must be a valid URL',
    matches: 'The image must include an extension.jpg or .png',
  },
  photos: {
    invalidFormat: 'Field photos must be an array',
    ArrayMinSize: 'there should be 6 photos',
    ArrayMaxSize: 'there should be 6 photos',
  },
  isPremium: {
    invalidFormat: 'isPremium must be an boolean',
  },
  typeOfHousing: {
    invalidFormat: 'typeOfHousing must be apartment, house, room or hotel',
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be an integer',
    minValue: 'Minimum roomsCount is 1',
    maxValue: 'Maximum roomsCount is 8',
  },
  guestsCount: {
    invalidFormat: 'guestsCount must be an integer',
    minValue: 'Minimum guestsCount is 1',
    maxValue: 'Maximum guestsCount is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  comforts: {
    invalidFormat:
      'Field comforts must be an array and type must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels or Fridge',
  },
  offerLocation: {
    invalidFormat: 'offerLocation is required',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
} as const;
