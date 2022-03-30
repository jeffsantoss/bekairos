import { env } from 'process'

export const ENVIRONMENT = process.env.NODE_ENV || 'dev'

/**
 * VPC Config
 */
export const ATTACH_VPC = env['ATTACH_VPC'] ?? false
export const VPC_ID = env['VPC_ID']!
export const SECURITY_GROUP_ID = env['SECURITY_GROUP_ID']!
export const SUBNET_IDS = env['SUBNET_IDS']!
