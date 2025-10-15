import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "pedidos" })
export default class Pedido extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

@Column({ length: 50, unique: true })
  numero: string;

@Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

@Column({ type: 'enum', enum: ['pendente', 'processando', 'concluido', 'cancelado'], default: 'pendente' })
  status: string;

@Column({ type: 'text', nullable: true })
  observacoes: string;

@CreateDateColumn({ name: "data_criacao" })
  dataCriacao: Date;
}