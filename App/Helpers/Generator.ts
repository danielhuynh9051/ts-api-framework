export function generateUserCode(prefix: string, length: number = 5) {
    return prefix + '-' + generateRandomString('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
}

export function generateRandomString(
    possibility: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    length: number = 10
) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += possibility.charAt(Math.floor(Math.random() * possibility.length));
    }
    return result;
}

export async function generateSummaryInfo(kolUser: any) {
    let summary_info = '';

    if (kolUser.facebook) {
        summary_info += (kolUser.facebook.entity_id || '') + ' ';
        summary_info += (kolUser.facebook.name || '') + ' ';
        summary_info += (kolUser.facebook.profile_link || '') + ' ';
    }

    if (kolUser.kol_info) summary_info += (kolUser.kol_info.mobile || '') + ' ';

    summary_info += (kolUser.email || '') + ' ';
    summary_info += (kolUser.code || '') + ' ';

    kolUser.summary_info = summary_info.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function generateSlug(text: string, slugList: string[]): string {
    let slug = text
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,: ]+/g, '-')
        .replace(/[^a-zA-Z0-9-đ]+/g, '')
        .toLowerCase()
        .replace(/đ/g, 'd');

    while (slugList.indexOf(slug) !== -1) {
        slug += '-' + generateRandomString('abcdefghijklmnopqrstuvwxyz0123456789', 4);
    }

    return slug;
}

/**
 * Generate token for reset password feature
 *
 * @param {string} id - ObjectId of user
 *
 * @return {string} - Reset password token
 */
export function generateResetPasswordToken(id: string) {
    let surfix = generateRandomString('abcdef0123456789', 48);

    return surfix + id;
}

export function getLimitPricePayment() {
    return process.env.LIMIT_PRICE_PAYMENT || 100000;
}

export function excuteVi2En(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function getKeyFromText(key: string) {
    return excuteVi2En(key)
        .toLowerCase()
        .replace(/\ /g, '-');
}

export enum DebugType {
    Error = 1
}
export function showDebug(data: any, type: number = 1) {
    if (type && type == DebugType.Error) {
        console.log(`\x1b[41m \x1b[37m ${JSON.stringify(data)}\x1b[0m`);
    } else {
        console.log(data);
    }
}

export function showNotify(data: any) {
    console.log(`\x1b[41m \x1b[36m ${JSON.stringify(data)}\x1b[0m`);
}

export function formatPrice(price: number) {
    return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function checkFollowerNumber(follower: Number, private_code?: string) {
    const require_follower: Number = getRequireFollower();
    showDebug(['Rerquired follower', require_follower]);

    let check_follower = follower >= require_follower;
    if (private_code && checkPrivateCodeAuth(private_code)) {
        showDebug('allow with private code');
        check_follower = true;
    }

    return check_follower;
}

export function getRequireFollower() {
    return process.env.REQUIRE_FOLLOWER_NUMBER ? parseInt(process.env.REQUIRE_FOLLOWER_NUMBER) : 0;
}

export function checkPrivateCodeAuth(code: string) {
    const privateCode = process.env.PRIVATE_CODE_AUTH || null;
    if (privateCode) {
        return privateCode == code;
    }

    return false;
}
