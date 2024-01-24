import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Member } from "./member.entity";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "district" })
@Unique(["osm_id"])
export class District {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 10, unique: true })
  @IsNotEmpty()
  osm_id!: string;

  @Column({ type: "geometry", spatialFeatureType: "Polygon", srid: 4326 })
  @IsNotEmpty()
  geometry: any;

  // * Relation
  @ManyToOne(() => Member, (member) => member.districts)
  // @JoinColumn({ name: "memberId" })
  member: Member[] | any;
}
