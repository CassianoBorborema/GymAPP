export interface CadastrarAlunoInput {
  name: string;
  email: string;
  weight: number;
  password: string;
  CPF: string;
}

export interface BuscarAlunoInput {
  CPF?: string;
  email?: string;
}

export interface AlunoIdInput {
  id: string;
}

export interface UpdateAlunoInput {
  id: string;
  name?: string;
  email?: string;
  weight?: number;
  password?: string;
}

export interface AlunoOutput {
  id: string;
  name: string;
  email: string;
  weight: number;
  CPF: string;
}

