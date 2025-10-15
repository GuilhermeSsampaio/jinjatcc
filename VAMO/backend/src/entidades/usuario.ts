import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "usuarios" })
export default class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

@Column({ length: 120 })
  nome: string;

@Column({ length: 120, unique: true })
  email: string;

@Column({ length: 255 })
  senha: string;

@Column({ type: 'enum', enum: ['usuario', 'administrador'], default: 'usuario' })
  perfil: string;

@CreateDateColumn({ name: "data_criacao" })
  dataCriacao: Date;
}