import { z } from "zod";

const itemSchema = z.object({
  title: z.union([z.string(), z.any()]),
  content: z.any(),
});

export const itemsSchema = z.array(itemSchema);

export interface Item {
  id:number;
  title: JSX.Element;
  content: JSX.Element;
}
