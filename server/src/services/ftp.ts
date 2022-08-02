import { Client, AccessOptions } from "basic-ftp";

let client: Client;
let initCount = 0;

export const initFtpClient = async (opts?: AccessOptions) => {
  if (client) return client;

  client = new Client();
  await client.access(opts);

  initCount++;
  console.log(`FTP client initialization count: ${initCount}`);
  return client;
};
