import ModelInstance from "@edgarjeremy/sirius.adapter/dist/libs/ModelInstance";

export interface ClassRoomAttributes extends ModelInstance {
  name: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface PlanAttributes extends ModelInstance {
  file: string;
  description: {[any: string]: any}[];
  user_id?: number;
  class_room_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface QuestionerAttributes extends ModelInstance {
  question: string;
  answer: string;
  user_id?: number;
  class_room_id?: number;
  schedule_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface ScheduleAttributes extends ModelInstance {
  day_name: string;
	hour: string;
  user_id?: number;
  class_room_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface SettingAttributes extends ModelInstance {
  tolerance: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface SubjectAttributes extends ModelInstance {
  name: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface UserAttributes extends ModelInstance {
	name: string;
	type: 'lecturer' | 'chief' | 'administrator';
	username: string;
	password: string;
	created_at?: Date;
	updated_at?: Date;
}