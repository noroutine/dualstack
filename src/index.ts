import { createServer, Socket } from 'net';
import dns from 'node:dns';
import { AddressInfo } from 'node:net';
import IORedis, { Redis } from 'ioredis';

type DualStackCheckResult = {
    ipv6: boolean
    dualStack: boolean
}

let _dualStackCheckResult: DualStackCheckResult;

// Check for IPv6 and dual-stack support
export async function checkDualStackSupport(verbose = false): Promise<DualStackCheckResult> {
    // Return cached values if available
    if (_dualStackCheckResult !== undefined) {
        return _dualStackCheckResult;
    }

    if (verbose) {
        process.stdout.write('Checking dual-stack availability...');
    }

    const result = await new Promise<DualStackCheckResult>((resolve) => {
        const testServer = createServer();

        testServer.once('error', () => {
            testServer.close();
            resolve({ ipv6: false, dualStack: false });
        });

        testServer.listen(0, '::', () => {
            const addr = testServer.address() as AddressInfo;

            // Test IPv4 on the same port
            const testSocket = new Socket();
            testSocket.connect(addr.port, '127.0.0.1', () => {
                testSocket.destroy();
                testServer.close();
                resolve({ ipv6: true, dualStack: true });
            });

            testSocket.on('error', () => {
                testSocket.destroy();
                testServer.close();
                resolve({ ipv6: true, dualStack: false });
            });
        });

        setTimeout(() => {
            testServer.close();
            resolve({ ipv6: false, dualStack: false });
        }, 100);
    });

    if (verbose) {
        process.stdout.write(`${result.ipv6 ? (result.dualStack ? 'ipv6/ipv4' : 'ipv6') : 'ipv4'}\n`);
    }

    _dualStackCheckResult = result;

    return _dualStackCheckResult;
}

export async function createRedisConnection(redisUrl: string, failFast = false): Promise<Redis> {
    // Check if family param is already in URL
    // if it is explicit, we do not want to override that
    const hasFamily = redisUrl.includes('family=');

    // Check dual stack
    const { dualStack } = await checkDualStackSupport();

    return new IORedis(redisUrl, {
        ...(failFast ? {
            maxRetriesPerRequest: 0,
            retryStrategy: () => null
        } : {
            maxRetriesPerRequest: null  // BullMQ requirement
        }),
        ...((!hasFamily && dualStack) ? { family: 6 } : {})
    });
}

// Function to set DNS resolution preference if dualStack is enabled
export function resolveIpv6first(): void {
    dns.setDefaultResultOrder('ipv6first'); // Prefer IPv6 when resolving
}
