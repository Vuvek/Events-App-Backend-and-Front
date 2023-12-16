export interface IGuest {
    email: string;
    id: string;
  }
  
 export interface IDuration {
    hours: string;
    minutes: string;
  }

export interface IEventData {
    addGuest?: IGuest;
    date: string;
    description: string;
    duration?: IDuration;
    eventName: string;
    location: string;
    meetingRoom: string;
    notification?: string;
    reminder?: number;
    time: string;
    by?: string;
    imageUrls?: string;
  }


  export interface IAddGuests {
    email: string;
    id: string;
  }

  export interface ICloudImage {
    image: string;
    id: string;
  }

  export interface IFormikProps {
    setFieldValue: (
        field: string,
        value: string,
        shouldValidate?: boolean
      ) => void
  }

  export type IDurations = "duration" | "reminder"
  