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

import { FileModel } from '../models/ACS/file.model';
import { LoginSSOPage, UploadActions, StringUtil, ApiService, UserModel, getTestResources } from '@alfresco/adf-testing';
import { TagPage } from '../pages/adf/tag.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';

describe('Tag component', () => {

    const loginPage = new LoginSSOPage();
    const tagPage = new TagPage();
    const navigationBarPage = new NavigationBarPage();
    const resources = getTestResources();

    let acsUser: UserModel;
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);
    const pdfFileModel = new FileModel({ name: resources.Files.ADF_DOCUMENTS.PDF.file_name });
    const deleteFile = new FileModel({ name: StringUtil.generateRandomString() });
    const sameTag = StringUtil.generateRandomString().toLowerCase();

    const tagList = [
        StringUtil.generateRandomString().toLowerCase(),
        StringUtil.generateRandomString().toLowerCase(),
        StringUtil.generateRandomString().toLowerCase(),
        StringUtil.generateRandomString().toLowerCase()];

    const tags = [
        { tag: 'test-tag-01' }, { tag: 'test-tag-02' }, { tag: 'test-tag-03' }, { tag: 'test-tag-04' }, { tag: 'test-tag-05' },
        { tag: 'test-tag-06' }, { tag: 'test-tag-07' }, { tag: 'test-tag-08' }, { tag: 'test-tag-09' }, { tag: 'test-tag-10' },
        { tag: 'test-tag-11' }];

    let pdfUploadedFile;
    let nodeId;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser();

        await apiService.getInstance().login(acsUser.email, acsUser.password);

        pdfUploadedFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');

        nodeId = pdfUploadedFile.entry.id;

        const uploadedDeleteFile = await uploadActions.uploadFile(deleteFile.location, deleteFile.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        Object.assign(deleteFile, uploadedDeleteFile.entry);

        await apiService.getInstance().core.tagsApi.addTag(nodeId, tags);

        await loginPage.login(acsUser.email, acsUser.password);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

        await uploadActions.deleteFileOrFolder(pdfUploadedFile.entry.id);
    });

    it('[C260374] Should NOT be possible to add a new tag without Node ID', async () => {
        await navigationBarPage.clickTagButton();

        await expect(await tagPage.getNodeId()).toEqual('');
        await expect(await tagPage.getNewTagPlaceholder()).toEqual('New Tag');
        await expect(await tagPage.addTagButtonIsEnabled()).toEqual(false);
        await tagPage.checkTagListIsEmpty();
        await tagPage.checkTagListByNodeIdIsEmpty();
        await tagPage.addNewTagInput('a');

        await expect(await tagPage.addTagButtonIsEnabled()).toEqual(false);
        await expect(await tagPage.getNewTagInput()).toEqual('a');
    });

    it('[C268151] Should be possible to add a new tag to a Node', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(tagList[0]);

        await tagPage.checkTagIsDisplayedInTagList(tagList[0]);
        await tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0]);
    });

    it('[C260377] Should NOT be possible to add a tag that already exists', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(sameTag);
        await tagPage.checkTagIsDisplayedInTagList(sameTag);
        await tagPage.addTag(sameTag);
        await expect(await tagPage.getErrorMessage()).toEqual('Tag already exists');
    });

    it('[C260375] Should be possible to delete a tag', async () => {
        const deleteTag = StringUtil.generateRandomString().toUpperCase();

        await tagPage.insertNodeId(deleteFile.id);

        await tagPage.addTag(deleteTag);

        await tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.deleteTagFromTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.insertNodeId(deleteFile.id);

        await tagPage.addTag(deleteTag);

        await tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.deleteTagFromTagList(deleteTag.toLowerCase());

        await tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase());
    });

    it('[C286290] Should be able to hide the delete option from a tag component', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(tagList[3]);

        await tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[3]);
        await tagPage.checkDeleteTagFromTagListByNodeIdIsDisplayed(tagList[3]);

        await tagPage.clickShowDeleteButtonSwitch();

        await tagPage.checkDeleteTagFromTagListByNodeIdIsNotDisplayed(tagList[3]);
    });

    it('[C286472] Should be able to click Show more/less button on List Tags Content Services', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);

        await tagPage.checkShowMoreButtonIsDisplayed();
        await tagPage.checkShowLessButtonIsNotDisplayed();

        await expect(await tagPage.checkTagsOnList()).toEqual(10);

        await tagPage.clickShowMoreButton();
        await tagPage.checkShowLessButtonIsDisplayed();

        await tagPage.clickShowLessButton();
        await tagPage.checkShowLessButtonIsNotDisplayed();
    });

    it('[C260378] Should be possible to add multiple tags', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(tagList[2]);

        await browser.sleep(5000); // wait CS return tags

        await tagPage.checkTagListIsOrderedAscending();
        await tagPage.checkTagListByNodeIdIsOrderedAscending();
        await tagPage.checkTagListContentServicesIsOrderedAscending();
    });
});
