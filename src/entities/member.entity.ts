import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { IsDate, IsNotEmpty } from "class-validator";
import { Score } from "./score.entity";
import { District } from "./district.entity";

@Entity({ name: "member" })
@Unique(["nickname"])
export class Member {
  // [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: "varchar", length: 10 })
  @IsNotEmpty()
  name!: string;

  @Column({ type: "varchar", length: 20, unique: true })
  @IsNotEmpty()
  @Unique(["nickname"])
  nickname!: string;

  @Column({ type: "varchar", length: 10 })
  @IsNotEmpty()
  birthday!: string;

  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326 })
  @IsNotEmpty()
  location: any;

  @CreateDateColumn({ type: "timestamp" })
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date;

  // * Relation
  @OneToMany(() => Score, (score) => score.member)
  scores: Score[] | undefined;

  @OneToMany(() => District, (district) => district.member) // District 엔터티와 연결
  districts: District[] | undefined;
}
