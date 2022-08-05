import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const gateway = await prisma.satelliteServices.upsert({
    where: { name: 'ORBCOMM_V2' },
    create: { name: 'ORBCOMM_V2' },
    update: {},
  });

  const device = await prisma.devices.upsert({
    where: { deviceId: '01719706SKY8A3F' },
    create: {
      deviceId: '01719706SKY8A3F',
      satelliteServiceName: 'ORBCOMM_V2',
      status: 'ACTIVE',
    },
    update: {},
  });

  const attributes = await prisma.satelliteSendedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'fwrdId',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'fwrdId', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  const attributes2 = await prisma.satelliteSendedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'status',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'status', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });

  console.log(
    'EXECUTING SEED PRISMA =>' + { gateway, device, attributes, attributes2 },
  );
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
