<script lang="ts">
import { h, ref, onMounted } from 'vue'
import * as Icons from '@pixelium/web-vue/icon-hn/es'
const groupHnJson = `{"IconAndroid":"brands","IconAngellist":"brands","IconApple":"brands","IconArweave":"brands","IconBehance":"brands","IconBloomberg":"brands","IconBluesky":"brands","IconCrunchbase":"brands","IconDigg":"brands","IconDiscord":"brands","IconDiscourse":"brands","IconFacebookRound":"brands","IconFacebookSquare":"brands","IconFigma":"brands","IconGiphy":"brands","IconGithub":"brands","IconGolden":"brands","IconGoogleNews":"brands","IconGoogle":"brands","IconHackernoon":"brands","IconHuggingface":"brands","IconImgur":"brands","IconInstagram":"brands","IconIos":"brands","IconKaggle":"brands","IconLinkedin":"brands","IconMastodon":"brands","IconMinds":"brands","IconNewsbreak":"brands","IconNpm":"brands","IconOpenAi":"brands","IconPinterest":"brands","IconPodcasts":"brands","IconProductHunt":"brands","IconReddit":"brands","IconRss":"brands","IconSia":"brands","IconSteam":"brands","IconThreads":"brands","IconTiktok":"brands","IconTwitch":"brands","IconTwitter":"brands","IconUnsplash":"brands","IconViewblocks":"brands","IconWikipedia":"brands","IconX":"brands","IconYoutube":"brands","IconBusiness":"purcats","IconCloud":"purcats","IconCybersecurity":"purcats","IconDataScience":"purcats","IconFinance":"purcats","IconFuturism":"purcats","IconGaming":"purcats","IconHackernoonPurcat":"purcats","IconLifeHacking":"purcats","IconMachineLearning":"purcats","IconManagement":"purcats","IconMedia":"purcats","IconProductManagement":"purcats","IconProgramming":"purcats","IconRemote":"purcats","IconScience":"purcats","IconSociety":"purcats","IconStartups":"purcats","IconTechCompanies":"purcats","IconTechStories":"purcats","IconTechnology":"purcats","IconWeb3":"purcats","IconWriting":"purcats","IconAd":"regular","IconAlignCenter":"regular","IconAlignJustify":"regular","IconAlignLeft":"regular","IconAlignRight":"regular","IconAnalytics":"regular","IconAngleDown":"regular","IconAngleLeft":"regular","IconAngleRight":"regular","IconAngleUp":"regular","IconArrowAltCircleDown":"regular","IconArrowAltCircleLeft":"regular","IconArrowAltCircleRight":"regular","IconArrowAltCircleUp":"regular","IconArrowCircleDown":"regular","IconArrowCircleLeft":"regular","IconArrowCircleRight":"regular","IconArrowCircleUp":"regular","IconArrowDown":"regular","IconArrowLeft":"regular","IconArrowRight":"regular","IconArrowUp":"regular","IconAt":"regular","IconBadgeCheck":"regular","IconBank":"regular","IconBars":"regular","IconBellExclaimation":"regular","IconBellMute":"regular","IconBell":"regular","IconBold":"regular","IconBolt":"regular","IconBookHeart":"regular","IconBookmark":"regular","IconBoxUsd":"regular","IconBrightnessHigh":"regular","IconBrightnessLow":"regular","IconBulletList":"regular","IconBullhorn":"regular","IconCalender":"regular","IconCc":"regular","IconChartLine":"regular","IconChartNetwork":"regular","IconCheckBox":"regular","IconCheckCircle":"regular","IconCheckList":"regular","IconCheck":"regular","IconChevronDown":"regular","IconChevronUp":"regular","IconCircleNotch":"regular","IconClipboard":"regular","IconClock":"regular","IconCloudDownloadAlt":"regular","IconCloudUpload":"regular","IconCodeBlock":"regular","IconCode":"regular","IconCog":"regular","IconCommentDots":"regular","IconCommentQuote":"regular","IconComment":"regular","IconComments":"regular","IconCopy":"regular","IconCreditCard":"regular","IconCrown":"regular","IconDivider":"regular","IconDownloadAlt":"regular","IconDownload":"regular","IconEdit":"regular","IconEllipsesHorizontalCircle":"regular","IconEllipsesHorizontal":"regular","IconEllipsesVerticalCircle":"regular","IconEllipsesVertical":"regular","IconEnvelope":"regular","IconExclaimation":"regular","IconExclamationTriangle":"regular","IconExpand":"regular","IconExternalLink":"regular","IconEyeCross":"regular","IconEye":"regular","IconFaceThinking":"regular","IconFileImport":"regular","IconFilterAltCircle":"regular","IconFilter":"regular","IconFire":"regular","IconFlagCheckered":"regular","IconFlag":"regular","IconFolderOpen":"regular","IconFolder":"regular","IconGlobeAmericas":"regular","IconGlobe":"regular","IconGrid":"regular","IconH1":"regular","IconH2":"regular","IconH3":"regular","IconHeadphones":"regular","IconHeart":"regular","IconHighlight":"regular","IconHockeyMask":"regular","IconHome":"regular","IconImage":"regular","IconIndent":"regular","IconInfoCircle":"regular","IconItalics":"regular","IconLightbulb":"regular","IconLineHeight":"regular","IconLink":"regular","IconLocationPin":"regular","IconLockAlt":"regular","IconLockOpen":"regular","IconLock":"regular","IconLogin":"regular","IconLogout":"regular","IconMessageDots":"regular","IconMessage":"regular","IconMinus":"regular","IconMoon":"regular","IconMusic":"regular","IconNewspaper":"regular","IconNumberedList":"regular","IconOctagonCheck":"regular","IconOctagonTimes":"regular","IconOutdent":"regular","IconPageBreak":"regular","IconPaperclip":"regular","IconParagraph":"regular","IconPause":"regular","IconPenNib":"regular","IconPen":"regular","IconPencilRuler":"regular","IconPencil":"regular","IconPeopleCarry":"regular","IconPhoneRingingHigh":"regular","IconPhoneRingingLow":"regular","IconPlaneDeparture":"regular","IconPlane":"regular","IconPlay":"regular","IconPlaylist":"regular","IconPlus":"regular","IconPrint":"regular","IconPro":"regular","IconQuestion":"regular","IconQuoteLeft":"regular","IconQuoteRight":"regular","IconReceipt":"regular","IconRefresh":"regular","IconRetroCamera":"regular","IconRobot":"regular","IconSave":"regular","IconSearch":"regular","IconSeedlings":"regular","IconShare":"regular","IconShop":"regular","IconShoppingCart":"regular","IconShuffle":"regular","IconSort":"regular","IconSoundMute":"regular","IconSoundOn":"regular","IconSparkles":"regular","IconSpinnerThird":"regular","IconSpinner":"regular","IconStarCrescent":"regular","IconStar":"regular","IconStrikeThrough":"regular","IconSun":"regular","IconTable":"regular","IconTag":"regular","IconTextSlash":"regular","IconThemes":"regular","IconThumbsdown":"regular","IconThumbsup":"regular","IconThumbtack":"regular","IconTimesCircle":"regular","IconTimes":"regular","IconTranslate":"regular","IconTrashAlt":"regular","IconTrash":"regular","IconTrending":"regular","IconTrophy":"regular","IconUnderline":"regular","IconUnlockAlt":"regular","IconUnlock":"regular","IconUploadAlt":"regular","IconUpload":"regular","IconUserCheck":"regular","IconUserHeadset":"regular","IconUser":"regular","IconUsersCrown":"regular","IconUsers":"regular","IconVoteYeah":"regular","IconWallet":"regular","IconWindowClose":"regular","IconAdSolid":"solid","IconAlignCenterSolid":"solid","IconAlignJustifySolid":"solid","IconAlignLeftSolid":"solid","IconAlignRightSolid":"solid","IconAnalyticsSolid":"solid","IconAngleDownSolid":"solid","IconAngleLeftSolid":"solid","IconAngleRightSolid":"solid","IconAngleUpSolid":"solid","IconArrowAltCircleDownSolid":"solid","IconArrowAltCircleLeftSolid":"solid","IconArrowAltCircleRightSolid":"solid","IconArrowAltCircleUpSolid":"solid","IconArrowCircleDownSolid":"solid","IconArrowCircleLeftSolid":"solid","IconArrowCircleRightSolid":"solid","IconArrowCircleUpSolid":"solid","IconArrowDownSolid":"solid","IconArrowLeftSolid":"solid","IconArrowRightSolid":"solid","IconArrowUpSolid":"solid","IconAtSolid":"solid","IconBadgeCheckSolid":"solid","IconBankSolid":"solid","IconBarsSolid":"solid","IconBellExclaimationSolid":"solid","IconBellMuteSolid":"solid","IconBellSolid":"solid","IconBoldSolid":"solid","IconBoltSolid":"solid","IconBookHeartSolid":"solid","IconBookmarkSolid":"solid","IconBoxUsdSolid":"solid","IconBrightnessHighSolid":"solid","IconBrightnessLowSolid":"solid","IconBulletListSolid":"solid","IconBullhornSolid":"solid","IconCalenderSolid":"solid","IconCcSolid":"solid","IconChartLineSolid":"solid","IconChartNetworkSolid":"solid","IconCheckBoxSolid":"solid","IconCheckCircleSolid":"solid","IconCheckListSolid":"solid","IconCheckSolid":"solid","IconChevronDownSolid":"solid","IconChevronUpSolid":"solid","IconCircleNotchSolid":"solid","IconClipboardSolid":"solid","IconClockSolid":"solid","IconCloudDownloadSolid":"solid","IconCloudUploadSolid":"solid","IconCodeBlockSolid":"solid","IconCodeSolid":"solid","IconCogSolid":"solid","IconCommentDotsSolid":"solid","IconCommentQuoteSolid":"solid","IconCommentSolid":"solid","IconCommentsSolid":"solid","IconCopySolid":"solid","IconCreditCardSolid":"solid","IconCrownSolid":"solid","IconDividerSolid":"solid","IconDownloadAltSolid":"solid","IconDownloadSolid":"solid","IconEditSolid":"solid","IconEllipsesHorizontalCircleSolid":"solid","IconEllipsesHorizontalSolid":"solid","IconEllipsesVerticalCircleSolid":"solid","IconEllipsesVerticalSolid":"solid","IconEnvelopeSolid":"solid","IconExclaimationSolid":"solid","IconExclamationTriangleSolid":"solid","IconExpandSolid":"solid","IconExternalLinkSolid":"solid","IconEyeCrossSolid":"solid","IconEyeSolid":"solid","IconFaceThinkingSolid":"solid","IconFileImportSolid":"solid","IconFilterAltCircleSolid":"solid","IconFilterSolid":"solid","IconFireSolid":"solid","IconFlagCheckeredSolid":"solid","IconFlagSolid":"solid","IconFolderOpenSolid":"solid","IconFolderSolid":"solid","IconGlobeAmericasSolid":"solid","IconGlobeSolid":"solid","IconGridSolid":"solid","IconHeading1Solid":"solid","IconHeading2Solid":"solid","IconHeading3Solid":"solid","IconHeadphonesSolid":"solid","IconHeartSolid":"solid","IconHighlightSolid":"solid","IconHockeyMaskSolid":"solid","IconHomeSolid":"solid","IconImageSolid":"solid","IconIndentSolid":"solid","IconInfoCircleSolid":"solid","IconItalicsSolid":"solid","IconLightbulbSolid":"solid","IconLineHeightSolid":"solid","IconLinkSolid":"solid","IconLocationPinSolid":"solid","IconLockAltSolid":"solid","IconLockOpenSolid":"solid","IconLockSolid":"solid","IconLoginSolid":"solid","IconLogoutSolid":"solid","IconMessageDotsSolid":"solid","IconMessageSolid":"solid","IconMinusSolid":"solid","IconMoonSolid":"solid","IconMusicSolid":"solid","IconNewspaperSolid":"solid","IconNumberedListSolid":"solid","IconOctagonCheckSolid":"solid","IconOctagonTimesSolid":"solid","IconOutdentSolid":"solid","IconPageBreakSolid":"solid","IconPaperclipSolid":"solid","IconParagraphSolid":"solid","IconPauseSolid":"solid","IconPenNibSolid":"solid","IconPenSolid":"solid","IconPencilRulerSolid":"solid","IconPencilSolid":"solid","IconPeopleCarrySolid":"solid","IconPhoneRingingHighSolid":"solid","IconPhoneRingingLowSolid":"solid","IconPlaneDepartureSolid":"solid","IconPlaneSolid":"solid","IconPlaySolid":"solid","IconPlaylistSolid":"solid","IconPlusSolid":"solid","IconPrintSolid":"solid","IconProSolid":"solid","IconQuestionSolid":"solid","IconQuoteLeftSolid":"solid","IconQuoteRightSolid":"solid","IconReceiptSolid":"solid","IconRefreshSolid":"solid","IconRetroCameraSolid":"solid","IconRobotSolid":"solid","IconSaveSolid":"solid","IconSearchSolid":"solid","IconSeedlingsSolid":"solid","IconShareSolid":"solid","IconShopSolid":"solid","IconShoppingCartSolid":"solid","IconShuffleSolid":"solid","IconSortSolid":"solid","IconSoundMuteSolid":"solid","IconSoundOnSolid":"solid","IconSparklesSolid":"solid","IconSpinnerSolid":"solid","IconSpinnerThirdSolid":"solid","IconStarCrescentSolid":"solid","IconStarSolid":"solid","IconStrikeThroughSolid":"solid","IconSunSolid":"solid","IconTableSolid":"solid","IconTagSolid":"solid","IconTextSlashSolid":"solid","IconThemesSolid":"solid","IconThumbsdownSolid":"solid","IconThumbsupSolid":"solid","IconThumbtackSolid":"solid","IconTimesCircleSolid":"solid","IconTimesSolid":"solid","IconTranslateSolid":"solid","IconTrashAltSolid":"solid","IconTrashSolid":"solid","IconTrendingSolid":"solid","IconTrophySolid":"solid","IconUnderlineSolid":"solid","IconUnlockAltSolid":"solid","IconUnlockSolid":"solid","IconUploadAltSolid":"solid","IconUploadSolid":"solid","IconUserCheckSolid":"solid","IconUserHeadsetSolid":"solid","IconUserSolid":"solid","IconUsersCrownSolid":"solid","IconUsersSolid":"solid","IconVoteYeahSolid":"solid","IconWalletSolid":"solid","IconWindowCloseSolid":"solid"}`
const groupHn = JSON.parse(groupHnJson)
const group: Record<string, any[]> = {}
Object.keys(Icons).forEach((key) => {
	const groupName = groupHn[key] as string
	if (groupName) {
		const name = groupName.slice(0, 1).toUpperCase() + groupName.slice(1)
		if (group[name]) {
			group[name].push({ key, icon: (Icons as any)[key] })
		} else {
			group[name] = [{ key, icon: (Icons as any)[key] }]
		}
	}
})

function copyTextToClipboard(text: string) {
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log('Text copied to clipboard')
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err)
				fallbackCopyTextToClipboard(text)
			})
	} else {
		fallbackCopyTextToClipboard(text)
	}
}

function fallbackCopyTextToClipboard(text: string) {
	const textarea = document.createElement('textarea')
	textarea.value = text
	textarea.style.position = 'fixed'
	textarea.style.opacity = '0'
	document.body.appendChild(textarea)
	textarea.select()
	try {
		const successful = document.execCommand('copy')
		const msg = successful ? 'successful' : 'unsuccessful'
		console.log('Fallback: Copying text command was ' + msg)
	} catch (err) {
		console.error('Fallback: Unable to copy text', err)
	}
	document.body.removeChild(textarea)
}
export default {
	setup() {
		const wrapperRef = ref<HTMLDivElement | null>(null)
		const col = ref(1)
		onMounted(() => {
			setTimeout(() => {
				if (wrapperRef.value) {
					col.value = Math.max(Math.floor(wrapperRef.value.clientWidth / 108), 1)
				}
			})
		})
		return () =>
			h('div', {}, [
				Object.keys(group).map((groupName) => {
					return h('div', { ref: (el: HTMLDivElement) => (wrapperRef.value = el) }, [
						h('h4', {}, [groupName]),
						h(
							'table',
							{ style: 'border-collapse: collapse;' },
							Array(Math.ceil(group[groupName].length / col.value))
								.fill(0)
								.map((_, rowIdx) => {
									return h(
										'tr',
										{},
										Array(col.value)
											.fill(0)
											.map((_, colIdx) => {
												return group[groupName][rowIdx * col.value + colIdx]
													? h(
															'td',
															{
																style: 'cursor: pointer; width: 108px; height: 108px; border: solid 1px var(--px-neutral-6);',
																onClick: () => {
																	copyTextToClipboard(group[groupName][rowIdx * col.value + colIdx].key)
																	$message.success(group[groupName][rowIdx * col.value + colIdx].key + ' Copied')
																}
															},
															[
																h(
																	'div',
																	{
																		style:
																			'display: flex; flex-direction: column; word-break: break-all; text-align: center; justify-content: space-between; align-items: center; height: 100%; padding: 32px 2px 4px 2px; box-sizing: border-box;'
																	},
																	[
																		h(group[groupName][rowIdx * col.value + colIdx].icon, { style: 'font-size: 20px; color: var(--px-neutral-9)' }),
																		h('span', { style: 'font-size: 12px; color: var(--px-neutral-8)' }, [
																			group[groupName][rowIdx * col.value + colIdx].key
																		])
																	]
																)
															]
														)
													: ''
											})
									)
								})
						)
					])
				})
			])
	}
}
</script>
