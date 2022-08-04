import { Client, AccessOptions } from "basic-ftp";

let client: Client;

export const initFtpClient = async (opts?: AccessOptions) => {
  if (client) return client;

  client = new Client();
  await client.access(opts);

  return client;
};
