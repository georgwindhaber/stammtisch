import { getAllMembers } from "./members.get";

export default eventHandler(async () => {
  const result = await getAllMembers(false);
  return result;
});
