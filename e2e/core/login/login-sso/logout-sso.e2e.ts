/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LoginSSOPage, SettingsPage, getTestConfig } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../../pages/adf/navigation-bar.page';

describe('Logout component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const testConfig = getTestConfig();

    it('[C280665] Should be possible change the logout redirect URL', async () => {
        await settingsPage.setProviderEcmSso(
            testConfig.adf.url,
            testConfig.appConfig.oauth2.host,
            testConfig.appConfig.identityHost,
            false,
            true,
            testConfig.appConfig.oauth2.clientId,
            '/login'
        );
        await loginSSOPage.loginSSOIdentityService(testConfig.admin.email, testConfig.admin.password);
        await navigationBarPage.clickLogoutButton();

        await browser.sleep(2000);

        const actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(testConfig.adf.url + '/login');
    });
});
