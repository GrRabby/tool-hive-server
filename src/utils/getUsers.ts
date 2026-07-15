import { getAuthDb } from "../config/db";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}


export const getUserById = async (id: string): Promise<PublicUser | null> => {
  const doc = await getAuthDb().collection("user").findOne({ id });
  if (!doc) return null;
  return { id: doc.id, name: doc.name, email: doc.email, role: doc.role };
};

export const getUsersByIds = async (ids: string[]): Promise<Record<string, PublicUser>> => {
  const uniqueIds = [...new Set(ids)];
  const docs = await getAuthDb()
    .collection("user")
    .find({ id: { $in: uniqueIds } })
    .toArray();

  const map: Record<string, PublicUser> = {};
  for (const doc of docs) {
    map[doc.id] = { id: doc.id, name: doc.name, email: doc.email, role: doc.role };
  }
  return map;
};
