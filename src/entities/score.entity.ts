// Import BaseEntity from TypeORM
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { IsInt, Min, Max, IsNotEmpty, IsIn } from "class-validator";
import { Member } from "./member.entity";

// Enum for valid subjects
enum Subject {
  MATH = "math",
  SCIENCE = "science",
  ENGLISH = "english",
}

@Entity({ name: "score" })
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 10 })
  @IsNotEmpty()
  @IsIn(Object.values(Subject), { message: "Invalid subject" })
  subject!: string;

  @Column({ type: "int" })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @CreateDateColumn({ type: "timestamp" })
  @IsNotEmpty()
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  @IsNotEmpty()
  updatedAt!: Date;

  // * Relation
  @ManyToOne(() => Member, (member) => member.scores, { onDelete: "CASCADE" })
  @JoinColumn({ name: "memberId" })
  member!: Member;
}
