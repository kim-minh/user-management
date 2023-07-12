export interface Users {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    status: number;
    address: string;
    avatar: string;
    gender: string;
    jobTypeId: number;
    jobType: {
        id: number;
        jobType: string;
    };
    cityId: number;
    city: {
        id: number;
        cityName: string;
    };
    updatedAt: Date;
    createdAt: Date;
}

export interface City {
  id: number,
  cityName: string,
}

export interface Job {
  id: number,
  jobType: string,
}