/**
 * Auth/User Feature Types
 */

export type Role = "USER" | "ADMIN"

export interface User {
    id: string
    name: string | null
    email: string
    image: string | null
    role: Role
}
