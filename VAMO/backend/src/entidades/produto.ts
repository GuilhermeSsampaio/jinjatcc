import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "produtos" })
export default class Produto extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

@Column({ length: 200 })
  nome: string;

@Column({ type: 'text', nullable: true })
  descricao: string;

@Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

@Column({ type: 'int', default: 0 })
  quantidade: number;

@Column({ default: true })
  ativo: boolean;

@CreateDateColumn({ name: "data_criacao" })
  dataCriacao: Date;
}