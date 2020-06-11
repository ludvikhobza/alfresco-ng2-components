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

import { browser } from 'protractor';
import { ApiService, LoginSSOPage, UploadActions, UserModel, getTestResources } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { UploadDialogPage } from '../../pages/adf/dialog/upload-dialog.page';
import { UploadTogglesPage } from '../../pages/adf/dialog/upload-toggles.page';
import { FileModel } from '../../models/ACS/file.model';
import { UsersActions } from '../../actions/users.actions';

describe('Upload component', async () => {

    const apiService = new ApiService();
    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialogPage();
    const uploadToggles = new UploadTogglesPage();
    const loginPage = new LoginSSOPage();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);
    const resources = getTestResources();

    let acsUser: UserModel;

    const pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const mediumFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.MEDIUM_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.MEDIUM_FILE.file_location
    });

    const largeFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();

        await apiService.login(acsUser.email, acsUser.password);
        await loginPage.login(acsUser.email, acsUser.password);
        await contentServicesPage.goToDocumentList();
    });

    const deleteNodesInCurrentPage = async function () {
        const nodeList = await contentServicesPage.getElementsDisplayedId();

        for (const node of nodeList) {
            try {
                await uploadActions.deleteFileOrFolder(node);
            } catch (error) {
            }
        }
    };

    it('[C272792] Should be possible to cancel upload of a big file using row cancel icon', async () => {
        await browser.executeScript(`setInterval(() => {document.querySelector('div[data-automation-id="cancel-upload-progress"]').click();}, 500)`);

        await contentServicesPage.uploadFile(mediumFile.location);

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(mediumFile.name);
    });

    it('[C287790] Should be possible to cancel upload of a big file through the cancel uploads button', async () => {
        await browser.executeScript(' setInterval(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 500)');

        await contentServicesPage.uploadFile(largeFile.location);
        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    it('[C272793] Should be able to cancel multiple files upload', async () => {
        await uploadToggles.enableMultipleFileUpload();

        await browser.executeScript(' setInterval(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 500)');

        await contentServicesPage.uploadMultipleFile([mediumFile.location, largeFile.location]);

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(mediumFile.name);
        await contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
        await uploadToggles.disableMultipleFileUpload();
    });

    it('[C315257] Should be able to cancel file in upload queue', async () => {
        await uploadToggles.enableMultipleFileUpload();

        await browser.executeScript(`setInterval(() => {document.querySelector('button[data-automation-id="cancel-upload-queue"]').click();}, 500)`);

        await contentServicesPage.uploadMultipleFile([mediumFile.location, pngFile.location]);
        await uploadDialog.fileIsCancelled(pngFile.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await uploadToggles.disableMultipleFileUpload();
        await deleteNodesInCurrentPage();
    });
});
