export interface InstructorInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface InstructorIdInput {
  id: string;
}

export interface UpdateInstructorInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
} 


export interface InstructorOutputDTO {
  id: string;
  name: string;
  email: string;
}

