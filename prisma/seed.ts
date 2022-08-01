import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const gateway = await prisma.satelliteGateway.upsert({
    where: { name: 'ORBCOMM_V2' },
    create: { name: 'ORBCOMM_V2' },
    update: {},
  });

  const device = await prisma.devices.upsert({
    where: { deviceId: '01719706SKY8A3F' },
    create: { deviceId: '01719706SKY8A3F', gatewayId: 1, status: 'ACTIVE' },
    update: {},
  });

  const attributes = await prisma.satelliteAttribute.upsert({
    where: { item: 'fwrdId' },
    create: { gateway: { connect: { name: 'ORBCOMM_V2' } }, item: 'fwrdId' },
    update: {},
  });
  const attributes2 = await prisma.satelliteAttribute.upsert({
    where: { item: 'statusOrbcomm' },
    create: {
      gateway: { connect: { name: 'ORBCOMM_V2' } },
      item: 'statusOrbcomm',
    },
    update: {},
  });

  console.log({ gateway, device, attributes, attributes2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
