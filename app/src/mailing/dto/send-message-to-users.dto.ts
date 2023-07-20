import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageToUsersDto {
  @IsOptional()
  @IsString()
  image_path?: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  with_btn?: boolean;

  @IsOptional()
  @IsString()
  btn_text?: string;

  @IsOptional()
  @IsString()
  btn_link?: string;

  @IsOptional()
  @IsBoolean()
  with_callback?: boolean;

  @IsOptional()
  @IsString()
  callback_response_text?: string;
}
