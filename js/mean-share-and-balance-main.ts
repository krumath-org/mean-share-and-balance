// Copyright 2022-2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import localeProperty from '../../joist/js/i18n/localeProperty.js';
import simLauncher from '../../joist/js/simLauncher.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import { combineOptions } from '../../phet-core/js/optionize.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import sceneryPhetQueryParameters from '../../scenery-phet/js/sceneryPhetQueryParameters.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import BalancePointScreen from './balance-point/BalancePointScreen.js';
import DistributeScreen from './distribute/DistributeScreen.js';
import FairShareScreen from './fair-share/FairShareScreen.js';
import LevelOutScreen from './level-out/LevelOutScreen.js';
import MeanShareAndBalanceStrings from './MeanShareAndBalanceStrings.js';

const simOptions: SimOptions = {
  homeScreenTitleFontFamily: 'Kantumruy Pro',

  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'John Blanco, Sam Reid, Marla Schulz',
    team: 'Catherine Carter, Kelly Findley, Marilyn Hartzell, Ariel Paul, Kathy Perkins, Taliesin Smith, David Webb',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Matthew Moore, Ashton Morris, Nancy Salpepi, Luisa Vargas, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer, Amanda McGarry',
    soundDesign: 'Emily Moore, Ashton Morris',
    thanks: 'Dor Abrahamson and the Embodied Design Research Lab (UC Berkeley) for their early input on the pedagogical design. '

  }
};

const createLanguageSwitch = (): HBox => {
  const createLanguageButton = ( label: string, locale: 'km' | 'en', segment: 'left' | 'right' ): TextPushButton => {
    const isLeftSegment = segment === 'left';
    const selectedProperty = new DerivedProperty( [ localeProperty ], currentLocale => currentLocale === locale, {
      tandem: Tandem.OPT_OUT
    } );

    return new TextPushButton( label, {
      font: new PhetFont( { family: 'Kantumruy Pro', size: 16, weight: 'bold' } ),
      textFill: 'white',
      minWidth: 78,
      minHeight: 38,
      xMargin: 12,
      yMargin: 7,
      baseColor: localeProperty.value === locale ? '#087e73' : '#37464a',
      stroke: '#9aafb0',
      lineWidth: 1,
      cornerRadius: 0,
      leftTopCornerRadius: isLeftSegment ? 8 : 0,
      leftBottomCornerRadius: isLeftSegment ? 8 : 0,
      rightTopCornerRadius: isLeftSegment ? 0 : 8,
      rightBottomCornerRadius: isLeftSegment ? 0 : 8,
      accessibleRoleConfiguration: 'toggle',
      accessiblePressedProperty: selectedProperty,
      listener: () => { localeProperty.value = locale; },
      tandem: Tandem.ROOT.createTandem( `languageSwitch${locale === 'km' ? 'Khmer' : 'English'}` )
    } );
  };

  const khmerButton = createLanguageButton( 'ខ្មែរ', 'km', 'left' );
  const englishButton = createLanguageButton( 'English', 'en', 'right' );

  localeProperty.link( locale => {
    khmerButton.baseColor = locale === 'km' ? '#087e73' : '#37464a';
    englishButton.baseColor = locale === 'en' ? '#087e73' : '#37464a';
  } );

  return new HBox( { children: [ khmerButton, englishButton ], spacing: 0 } );
};

// launch the sim - beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
const launchSimulation = (): void => {
  sceneryPhetQueryParameters.fontFamily = 'Kantumruy Pro';
  localeProperty.value = 'km';

  const sim = new Sim( MeanShareAndBalanceStrings[ 'mean-share-and-balance' ].titleStringProperty, [
    new LevelOutScreen( { tandem: Tandem.ROOT.createTandem( 'levelOutScreen' ) } ),
    new DistributeScreen( { tandem: Tandem.ROOT.createTandem( 'distributeScreen' ) } ),
    new FairShareScreen( { tandem: Tandem.ROOT.createTandem( 'fairShareScreen' ) } ),
    new BalancePointScreen(
      { tandem: Tandem.ROOT.createTandem( 'balancePointScreen' ) } )
  ], combineOptions<SimOptions>( {}, simOptions, { homeScreenWarningNode: createLanguageSwitch() } ) );
  sim.start();
};

const kantumruyFont = new FontFace(
  'Kantumruy Pro',
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; using the default font.', error );
  simLauncher.launch( launchSimulation );
} );